/**
 * OpenRouter LLM 调用
 * 文档: https://openrouter.ai/google/gemini-3.5-flash/api
 * 端点: POST https://openrouter.ai/api/v1/chat/completions
 */

export const DEFAULT_MODEL = 'google/gemini-3.5-flash'

export const MODELS = {
  gemini35Flash: 'google/gemini-3.5-flash',
  gemini3FlashPreview: 'google/gemini-3-flash-preview',
  learnlm: 'google/learnlm-1.5-pro-experimental:free',
  geminiFlash: 'google/gemini-2.0-flash-001',
} as const

export type ModelKey = keyof typeof MODELS

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string | Array<{ type: 'text' | 'image_url'; text?: string; image_url?: { url: string } }>
}

export interface OpenRouterOptions {
  model?: string
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  stream?: boolean
  systemPrompt?: string
}

function resolveModel(model?: string): string {
  if (!model) return DEFAULT_MODEL
  if (model in MODELS) return MODELS[model as ModelKey]
  return model
}

/** 过滤空消息，避免 OpenRouter 400 */
export function sanitizeMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.filter((m) => {
    if (m.role === 'system') return true
    if (typeof m.content === 'string') return m.content.trim().length > 0
    if (Array.isArray(m.content)) return m.content.length > 0
    return false
  })
}

export async function callOpenRouter(options: OpenRouterOptions): Promise<Response> {
  const config = useRuntimeConfig()
  const apiKey = config.openrouterApiKey as string

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: 'OpenRouter API Key 未配置，请在 .env 设置 OPENROUTER_GEMINI35_FLASH_API_KEY',
    })
  }

  const {
    model,
    messages,
    temperature = 0.7,
    maxTokens = 2048,
    stream = false,
    systemPrompt,
  } = options

  const allMessages: ChatMessage[] = []
  if (systemPrompt) {
    allMessages.push({ role: 'system', content: systemPrompt })
  }
  allMessages.push(...sanitizeMessages(messages))

  if (allMessages.filter(m => m.role === 'user').length === 0) {
    throw createError({ statusCode: 400, message: 'No user messages to send' })
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': config.public.appUrl as string || 'https://bearkid.app',
      'X-Title': 'DayDayUp',
    },
    body: JSON.stringify({
      model: resolveModel(model),
      messages: allMessages,
      temperature,
      max_tokens: maxTokens,
      stream,
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    let errMessage = errText
    try {
      const parsed = JSON.parse(errText)
      errMessage = parsed.error?.message ?? parsed.message ?? errText
    }
    catch { /* use raw text */ }

    throw createError({
      statusCode: response.status,
      message: `OpenRouter: ${errMessage}`,
    })
  }

  return response
}
