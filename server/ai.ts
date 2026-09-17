import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { getDormitoryRules } from './dormitory-rules.ts'
import { lookupRooms } from './rooms-repository.ts'
import { SYSTEM_PROMPT } from './prompts.ts'

const model = process.env.AI_MODEL ?? process.env.ANTHROPIC_DEFAULT_OPUS_MODEL ?? 'claude-opus-5'
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type AiSource = { id: string; label: string; version?: string; status?: 'demo' | 'draft' | 'approved'; effectiveDate?: string | null }

const roomLookupSchema = z.object({
  building: z.enum(['Tòa A', 'Tòa B', 'Tòa C']).optional(),
  gender: z.enum(['Nam', 'Nữ']).optional(),
  status: z.enum(['available', 'occupied', 'full', 'maintenance']).optional(),
  onlyAvailable: z.boolean().optional(),
  capacity: z.number().int().positive().max(20).optional(),
}).strict()
const rulesLookupSchema = z.object({ topic: z.string().trim().min(1).max(120).optional() }).strict()

const roomTool = {
  name: 'get_room_availability',
  description: 'Tra cứu phòng ký túc xá hiện tại. Gọi tool khi người dùng hỏi về phòng trống, công suất, tòa nhà, giới tính hoặc sức chứa. Chỉ đọc dữ liệu; không tạo, sửa, xóa hoặc phân phòng.',
  input_schema: {
    type: 'object',
    properties: {
      building: { type: 'string', enum: ['Tòa A', 'Tòa B', 'Tòa C'], description: 'Lọc theo tòa nhà.' },
      gender: { type: 'string', enum: ['Nam', 'Nữ'], description: 'Lọc theo khu nam/nữ.' },
      status: { type: 'string', enum: ['available', 'occupied', 'full', 'maintenance'], description: 'Trạng thái phòng.' },
      onlyAvailable: { type: 'boolean', description: 'Chỉ trả phòng còn giường và không bảo trì.' },
      capacity: { type: 'integer', description: 'Sức chứa tối thiểu của phòng.' },
    },
    required: [] as string[],
    additionalProperties: false,
  },
} as const
const rulesTool = {
  name: 'get_dormitory_rules',
  description: 'Tra cứu nội quy và hướng dẫn tham khảo của KTX ICTU. Gọi tool khi người dùng hỏi về giờ yên tĩnh, vệ sinh, khách thăm, an toàn, tài sản, báo sự cố hoặc chính sách KTX. Chỉ đọc; không phê duyệt, thay đổi hoặc tạo nội quy.',
  input_schema: {
    type: 'object',
    properties: { topic: { type: 'string', description: 'Chủ đề nội quy cần tra cứu, tối đa 120 ký tự.' } },
    required: [] as string[],
    additionalProperties: false,
  },
} as const

function roomResult(input: z.infer<typeof roomLookupSchema>) {
  return JSON.stringify({ count: lookupRooms(input).length, rooms: lookupRooms(input).map((room) => ({ code: room.code, building: room.building, floor: room.floor, gender: room.gender, capacity: room.capacity, occupied: room.occupied, availableBeds: room.capacity - room.occupied, status: room.status })) })
}
function rulesResult(input: z.infer<typeof rulesLookupSchema>) {
  const result = getDormitoryRules(input)
  return JSON.stringify({ ...result, source: { id: result.source.id, label: result.source.label } })
}
const roomSource: AiSource = { id: 'rooms-current', label: 'Dữ liệu phòng hiện tại' }

export type ChatMessage = z.infer<typeof messageSchema>
const messageSchema = z.object({ role: z.enum(['user', 'assistant']), content: z.string().trim().min(1).max(4000) })
const requestSchema = z.object({ messages: z.array(messageSchema).min(1).max(20) }).superRefine(({ messages }, context) => {
  if (messages[0]?.role !== 'user') context.addIssue({ code: 'custom', path: ['messages', 0, 'role'], message: 'Lịch sử hội thoại phải bắt đầu bằng user.' })
  messages.slice(1).forEach((message, index) => { if (message.role === messages[index].role) context.addIssue({ code: 'custom', path: ['messages', index + 1, 'role'], message: 'Các tin nhắn user và assistant phải luân phiên.' }) })
})

export async function chatWithDormitoryAssistant(input: unknown) {
  const parsed = requestSchema.parse(input)
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('Thiếu ANTHROPIC_API_KEY. Backend chưa được cấu hình.')

  // Always use direct Anthropic SDK for tool calling - gateway path with free models is unreliable
  let messages: Anthropic.MessageParam[] = parsed.messages.map((message) => ({ role: message.role, content: message.content }))
  const sources = new Map<string, AiSource>()
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await client.messages.create({ model, max_tokens: 1200, thinking: { type: 'adaptive' }, output_config: { effort: 'medium' }, system: SYSTEM_PROMPT, tools: [roomTool, rulesTool], messages })
    if (response.stop_reason === 'refusal') throw new Error('AI từ chối xử lý yêu cầu này.')
    messages = [...messages, { role: 'assistant', content: response.content }]
    // Handle case where response.content might be undefined
    const content = response.content ?? []
    const toolUses = content.filter((block): block is Anthropic.ToolUseBlock => block.type === 'tool_use')
    if (toolUses.length === 0) {
      const text = content.filter((block): block is Anthropic.TextBlock => block.type === 'text').map((block) => block.text).join('\n').trim()
      return { message: text || 'AI chưa tạo được câu trả lời.', sources: [...sources.values()], model: response.model }
    }
    const results: Anthropic.ToolResultBlockParam[] = []
    for (const toolUse of toolUses) {
      if (toolUse.name === roomTool.name) {
        const toolInput = roomLookupSchema.safeParse(toolUse.input)
        if (!toolInput.success) { results.push({ type: 'tool_result', tool_use_id: toolUse.id, content: 'Tham số tra cứu phòng không hợp lệ.', is_error: true }); continue }
        sources.set(roomSource.id, roomSource); results.push({ type: 'tool_result', tool_use_id: toolUse.id, content: roomResult(toolInput.data) }); continue
      }
      if (toolUse.name === rulesTool.name) {
        const toolInput = rulesLookupSchema.safeParse(toolUse.input)
        if (!toolInput.success) { results.push({ type: 'tool_result', tool_use_id: toolUse.id, content: 'Tham số tra cứu nội quy không hợp lệ.', is_error: true }); continue }
        const result = getDormitoryRules(toolInput.data); sources.set(result.source.id, result.source); results.push({ type: 'tool_result', tool_use_id: toolUse.id, content: rulesResult(toolInput.data) }); continue
      }
      results.push({ type: 'tool_result', tool_use_id: toolUse.id, content: 'Tool không được phép.', is_error: true })
    }
    messages.push({ role: 'user', content: results })
  }
  throw new Error('AI vượt quá số vòng xử lý cho phép.')
}