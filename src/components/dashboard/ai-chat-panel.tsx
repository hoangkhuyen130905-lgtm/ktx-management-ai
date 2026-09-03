import { Bot, Send, Sparkles, UserRound } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '../ui/button'

type AiSource = { id: string; label: string; version?: string; status?: 'demo' | 'draft' | 'approved'; effectiveDate?: string | null }
type ChatMessage = { role: 'user' | 'assistant'; content: string; sources?: AiSource[] }
const starter: ChatMessage[] = [{ role: 'assistant', content: 'Xin chào. Tôi có thể tra cứu phòng và giải thích nội quy KTX ICTU.' }]

export function AiChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>(starter)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  async function submit(event: FormEvent) {
    event.preventDefault()
    const content = input.trim()
    if (!content || loading) return
    const previousMessages = messages
    const next = [...messages, { role: 'user' as const, content }]
    const recentMessages = next.filter((message) => message.role === 'user' || message.role === 'assistant').slice(-12)
    const firstUserIndex = recentMessages.findIndex((message) => message.role === 'user')
    const history = recentMessages.slice(firstUserIndex)
    setMessages(next); setInput(''); setError(''); setLoading(true)
    try {
      const response = await fetch('/api/ai/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages: history }) })
      const data = await response.json() as { message?: string; error?: string; sources?: AiSource[] }
      if (!response.ok) throw new Error(data.error ?? 'Không thể kết nối AI.')
      setMessages((current) => [...current, { role: 'assistant', content: data.message ?? 'AI chưa trả lời.', sources: data.sources }])
    } catch (caught) {
      setMessages(previousMessages)
      setError(caught instanceof Error ? caught.message : 'Không thể kết nối AI. Hãy kiểm tra backend và API key.')
    } finally { setLoading(false) }
  }
  return <section className="ai-panel card" aria-label="Trợ lý AI ký túc xá"><div className="ai-panel-header"><div className="ai-panel-title"><span className="ai-icon"><Sparkles size={16} /></span><div><h2>Trợ lý KTX AI</h2><p>Tra cứu phòng và nội quy KTX</p></div></div><span className="ai-live"><span /> Read-only</span></div><div className="ai-messages" aria-live="polite">{messages.map((message, index) => <div className={`ai-message ${message.role}`} key={`${message.role}-${index}`}><span className="ai-message-icon">{message.role === 'assistant' ? <Bot size={15} /> : <UserRound size={15} />}</span><div><p>{message.content}</p>{message.sources?.map((source) => <span className="ai-source" key={source.id}>Nguồn: {source.label}</span>)}</div></div>)}{loading && <div className="ai-message assistant"><span className="ai-message-icon"><Bot size={15} /></span><div className="ai-typing"><span /><span /><span /></div></div>}</div><form className="ai-composer" onSubmit={submit}><input className="form-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ví dụ: Giờ yên tĩnh hoặc Tòa A còn phòng nào trống?" aria-label="Nhập câu hỏi cho trợ lý AI" disabled={loading} /><Button type="submit" aria-label="Gửi câu hỏi" disabled={loading || !input.trim()}><Send size={16} /></Button></form>{error && <p className="ai-error" role="alert">{error}</p>}<p className="ai-disclaimer">AI chỉ cung cấp thông tin hỗ trợ. Quyết định chính thức thuộc Ban quản lý.</p></section>
}
