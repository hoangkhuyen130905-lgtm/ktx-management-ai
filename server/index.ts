import { createServer } from 'node:http'
import { chatWithDormitoryAssistant } from './ai.ts'

const port = Number(process.env.PORT ?? process.env.AI_PORT ?? 8787)
const maxBodySize = 32_000

function sendJson(response: import('node:http').ServerResponse, status: number, body: unknown) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  response.end(JSON.stringify(body))
}

async function readBody(request: import('node:http').IncomingMessage) {
  let body = ''
  for await (const chunk of request) {
    body += chunk
    if (body.length > maxBodySize) throw new Error('Request vượt quá giới hạn 32KB.')
  }
  return JSON.parse(body || '{}') as unknown
}

const server = createServer(async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (request.method === 'OPTIONS') {
    response.writeHead(204)
    response.end()
    return
  }

  if (request.method === 'GET' && request.url === '/health') {
    sendJson(response, 200, {
      status: 'ok',
      service: 'dormitory-ai'
    })
    return
  }

  if (request.method === 'POST' && request.url === '/api/ai/chat') {
    try {
      sendJson(
        response,
        200,
        await chatWithDormitoryAssistant(await readBody(request))
      )
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'AI service error'

      const status = message.includes('ANTHROPIC_API_KEY')
        ? 503
        : 400

      sendJson(response, status, { error: message })
    }

    return
  }

  sendJson(response, 404, {
    error: 'Không tìm thấy endpoint.'
  })
})

server.listen(port, '0.0.0.0', () => console.log(`AI backend listening on port ${port}`))
