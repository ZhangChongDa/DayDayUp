/**
 * useChatStream — SSE 流式 LLM 对话 composable
 * 消费 /api/chat/stream 的统一事件：delta | done | error
 */

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  attachments?: Array<{
    type: 'image' | 'audio'
    url: string
    name?: string
    durationSec?: number
  }>
  createdAt: Date
}

type StreamEvent =
  | { type: 'delta'; content: string }
  | { type: 'done' }
  | { type: 'error'; message: string }

export function useChatStream() {
  const messages = ref<Message[]>([])
  const isThinking = ref(false)
  const isTalking = ref(false)
  const isStreaming = ref(false)
  const streamingMessageId = ref<string | null>(null)
  const error = ref<string | null>(null)

  let abortController: AbortController | null = null

  function generateId() {
    return Math.random().toString(36).slice(2, 11)
  }

  function appendAssistantDelta(assistantIdx: number, delta: string) {
    const current = messages.value[assistantIdx]
    messages.value[assistantIdx] = {
      ...current,
      content: current.content + delta,
    }
  }

  function parseSSELine(line: string): StreamEvent | null {
    if (!line.startsWith('data: ')) return null
    const data = line.slice(6).trim()
    if (!data || data === '[DONE]') return { type: 'done' }

    try {
      const parsed = JSON.parse(data) as StreamEvent & {
        choices?: Array<{ delta?: { content?: string; text?: string } }>
      }

      if (parsed.type === 'delta' || parsed.type === 'done' || parsed.type === 'error') {
        return parsed
      }

      // 兼容直接透传的 OpenRouter 原始 chunk
      const legacyDelta = parsed.choices?.[0]?.delta?.content ?? parsed.choices?.[0]?.delta?.text
      if (legacyDelta) return { type: 'delta', content: legacyDelta }
    }
    catch {
      return null
    }

    return null
  }

  async function consumeSSEStream(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    assistantIdx: number,
  ) {
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line || line.startsWith(':')) continue

        const event = parseSSELine(line)
        if (!event) continue

        if (event.type === 'delta' && event.content) {
          appendAssistantDelta(assistantIdx, event.content)
        }
        else if (event.type === 'error') {
          throw new Error(event.message)
        }
        else if (event.type === 'done') {
          return
        }
      }
    }
  }

  async function sendMessage(
    content: string,
    attachments?: Message['attachments'],
  ): Promise<{ assistantId: string; assistantText: string } | null> {
    if (!content.trim() && (!attachments || attachments.length === 0)) return null

    error.value = null

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      attachments,
      createdAt: new Date(),
    }
    messages.value.push(userMsg)

    const assistantMsg: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      createdAt: new Date(),
    }
    messages.value.push(assistantMsg)
    const assistantIdx = messages.value.length - 1
    streamingMessageId.value = assistantMsg.id

    isThinking.value = true
    isTalking.value = false
    isStreaming.value = false

    abortController = new AbortController()

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.value
            .slice(0, -1)
            .map(m => ({
              role: m.role,
              content: m.attachments?.length
                ? buildMultimodalContent(m.content, m.attachments)
                : m.content,
            }))
            .filter(m => {
              if (m.role === 'user') return true
              if (typeof m.content === 'string') return m.content.trim().length > 0
              return Array.isArray(m.content) && m.content.length > 0
            }),
        }),
        signal: abortController.signal,
      })

      if (!response.ok) {
        let detail = `HTTP ${response.status}`
        try {
          const errBody = await response.json()
          detail = errBody?.message ?? errBody?.statusMessage ?? detail
        }
        catch {
          try {
            detail = await response.text() || detail
          }
          catch { /* keep status */ }
        }
        throw new Error(detail)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No readable stream')

      isThinking.value = false
      isTalking.value = true
      isStreaming.value = true

      await consumeSSEStream(reader, assistantIdx)

      const final = messages.value[assistantIdx]
      if (final?.content?.trim()) {
        return { assistantId: final.id, assistantText: final.content }
      }
      return null
    }
    catch (e: any) {
      if (e.name === 'AbortError') return null
      error.value = e.message ?? 'Unknown error'
      if (!messages.value[assistantIdx]?.content) {
        messages.value[assistantIdx] = {
          ...messages.value[assistantIdx],
          content: '出错了，请重试。',
        }
      }
    }
    finally {
      isThinking.value = false
      isTalking.value = false
      isStreaming.value = false
      streamingMessageId.value = null
      abortController = null
    }

    return null
  }

  function buildMultimodalContent(
    text: string,
    attachments: Message['attachments'],
  ) {
    const parts: any[] = []
    if (text) parts.push({ type: 'text', text })
    for (const att of attachments ?? []) {
      if (att.type === 'image') {
        parts.push({ type: 'image_url', image_url: { url: att.url } })
      }
    }
    return parts
  }

  function abort() {
    abortController?.abort()
    isThinking.value = false
    isTalking.value = false
    isStreaming.value = false
    streamingMessageId.value = null
  }

  function clearMessages() {
    abort()
    messages.value = []
    error.value = null
  }

  return {
    messages: readonly(messages),
    isThinking: readonly(isThinking),
    isTalking: readonly(isTalking),
    isStreaming: readonly(isStreaming),
    streamingMessageId: readonly(streamingMessageId),
    error,
    sendMessage,
    abort,
    clearMessages,
  }
}
