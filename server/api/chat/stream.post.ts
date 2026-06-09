/**
 * POST /api/chat/stream
 * SSE 流式 LLM 回复（OpenRouter google/gemini-3.5-flash）
 * 将 OpenRouter 原始 SSE 转为统一事件：delta | done | error
 */

const SYSTEM_PROMPT = `你是 DayDayUp AI 学习伙伴——一个温暖、聪明、有趣的教育助手。

核心原则：
1. 【苏格拉底式引导】不直接给答案，先用问题引导学生思考
2. 【脚手架教学】将复杂问题拆解为小步骤，逐步引导
3. 【费曼技巧】鼓励学生用自己的话复述知识
4. 【积极强化】发现亮点，具体表扬，不泛化夸奖
5. 【年龄适配】根据年级调整语言深度和例子

回复格式：
- 使用 Markdown 格式（支持公式、代码块、列表）
- 保持简洁，避免过长回复
- 在适当时候使用 emoji 增加亲切感
- 数学公式用 LaTeX：行内用 $...$，块级用 $$...$$`

type StreamEvent =
  | { type: 'delta'; content: string }
  | { type: 'done' }
  | { type: 'error'; message: string }

function encodeSSE(event: StreamEvent): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`)
}

/** 解析 OpenRouter SSE，逐条向前端推送 delta */
function createNormalizedStream(upstream: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder()
  let buffer = ''
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null

  return new ReadableStream({
    async start(controller) {
      reader = upstream.getReader()

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line || line.startsWith(':')) continue
            if (!line.startsWith('data: ')) continue

            const data = line.slice(6).trim()
            if (data === '[DONE]') {
              controller.enqueue(encodeSSE({ type: 'done' }))
              continue
            }

            try {
              const parsed = JSON.parse(data) as {
                error?: { message?: string }
                choices?: Array<{ delta?: { content?: string; text?: string }; finish_reason?: string }>
              }

              if (parsed.error?.message) {
                controller.enqueue(encodeSSE({ type: 'error', message: parsed.error.message }))
                continue
              }

              const delta = parsed.choices?.[0]?.delta
              const content = delta?.content ?? delta?.text ?? ''
              if (content) {
                controller.enqueue(encodeSSE({ type: 'delta', content }))
              }
            }
            catch {
              // 忽略非 JSON 行（OpenRouter 心跳注释等）
            }
          }
        }

        controller.enqueue(encodeSSE({ type: 'done' }))
        controller.close()
      }
      catch (e) {
        const message = e instanceof Error ? e.message : 'Stream read failed'
        controller.enqueue(encodeSSE({ type: 'error', message }))
        controller.close()
      }
      finally {
        reader?.releaseLock()
      }
    },
    cancel() {
      reader?.cancel()
    },
  })
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string | unknown[] }>
    model?: string
  }>(event)

  if (!body.messages || !Array.isArray(body.messages)) {
    throw createError({ statusCode: 400, message: 'messages required' })
  }

  setResponseHeaders(event, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  })

  const config = useRuntimeConfig()

  let response: Response
  try {
    response = await callOpenRouter({
      model: body.model ?? (config.openrouterModel as string) ?? DEFAULT_MODEL,
      messages: body.messages as Parameters<typeof callOpenRouter>[0]['messages'],
      stream: true,
      systemPrompt: SYSTEM_PROMPT,
    })
  }
  catch (e: unknown) {
    const err = e as { statusCode?: number; message?: string }
    throw createError({
      statusCode: err.statusCode ?? 502,
      message: err.message ?? 'LLM request failed',
    })
  }

  const upstream = response.body
  if (!upstream) throw createError({ statusCode: 500, message: 'No stream' })

  return createNormalizedStream(upstream)
})
