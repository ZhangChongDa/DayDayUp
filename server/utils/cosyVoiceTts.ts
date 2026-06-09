/**
 * CosyVoice 非实时语音合成
 * 文档: CodingDoc/CosyVoice-3-TTS.md
 */

import { prepareTextForTts } from './ttsText'

const TTS_ENDPOINT = 'https://dashscope.aliyuncs.com/api/v1/services/audio/tts/SpeechSynthesizer'

export const COSYVOICE_MODEL_V35 = 'cosyvoice-v3.5-flash'
export const COSYVOICE_MODEL_V3 = 'cosyvoice-v3-flash'

/** 文档示例默认系统音色（测试用） */
export const COSYVOICE_DEFAULT_TEST_VOICE = 'longanyang'
export const COSYVOICE_VOICE_LONGANHUAN = 'longanhuan_v3'

const V35_MODELS = new Set([COSYVOICE_MODEL_V35, 'cosyvoice-v3.5-plus'])

/** v3.5 无系统音色；下列为 v3-flash 系统音色 */
const SYSTEM_VOICES = new Set([
  'longanyang',
  'longanhuan_v3',
  'longxing_v3',
  'longxiaochun',
  'longxiaoxia',
  'longlaotie',
  'longshu',
  'longshuo',
  'longjielidou',
  'longtong',
  'longxiang',
  'loongstella',
  'loongbella',
])

export interface CosyVoiceTtsOptions {
  voice?: string
  model?: string
  instruction?: string
  format?: 'mp3' | 'wav' | 'opus' | 'pcm'
  sampleRate?: number
  languageHints?: string[]
}

interface CosyVoiceResponse {
  output?: {
    finish_reason?: string
    audio?: {
      data?: string
      url?: string
    }
  }
  code?: string
  message?: string
}

function isSystemVoice(voice: string): boolean {
  return SYSTEM_VOICES.has(voice)
}

function resolveDashscopeApiKey(): string {
  const config = useRuntimeConfig()
  const key = (
    config.dashscopeApiKey
    || config.qwen3AsrFlashApiKey
    || process.env.QWEN3_ASR_FLASH_API_KEY
    || process.env.DASHSCOPE_API_KEY
  ) as string

  if (!key) {
    throw createError({
      statusCode: 500,
      message: 'DashScope API Key 未配置，请在 .env 设置 QWEN3_ASR_FLASH_API_KEY',
    })
  }

  return key
}

/**
 * 解析模型 / 音色 / instruction
 * - 目标模型 cosyvoice-v3.5-flash + 系统默认音色 → 测试期自动降级 v3-flash（阿里云限制）
 * - v3-flash 系统音色勿传方言 instruction（会 428）
 * - v3.5 + 声音设计/复刻音色 → 可使用自由 instruction
 */
function resolveSynthesisTarget(options: CosyVoiceTtsOptions) {
  const config = useRuntimeConfig()
  const requestedModel = options.model || (config.cosyvoiceModel as string) || COSYVOICE_MODEL_V35
  const voice = options.voice || (config.cosyvoiceVoice as string) || COSYVOICE_DEFAULT_TEST_VOICE

  let model = requestedModel
  let instruction: string | undefined

  const useV35 = V35_MODELS.has(requestedModel)

  if (useV35 && isSystemVoice(voice)) {
    // v3.5 不支持系统音色；测试默认人声 longanyang 等自动走 v3-flash
    model = COSYVOICE_MODEL_V3
  }

  if (V35_MODELS.has(model)) {
    instruction = options.instruction
      || (config.cosyvoiceInstruction as string | undefined)
      || '请用活泼俏皮的语气说话，带着明显的笑意。'
  }
  // v3-flash 系统音色：不传 instruction，避免 428

  return { model, voice, instruction }
}

export async function synthesizeCosyVoice(
  text: string,
  options: CosyVoiceTtsOptions = {},
): Promise<{ buffer: Buffer; mimeType: string }> {
  const prepared = prepareTextForTts(text)
  if (!prepared) {
    throw createError({ statusCode: 400, message: 'No text to synthesize' })
  }

  const apiKey = resolveDashscopeApiKey()
  const { model, voice, instruction } = resolveSynthesisTarget(options)

  const input: Record<string, unknown> = {
    text: prepared,
    voice,
    format: options.format ?? 'mp3',
    sample_rate: options.sampleRate ?? 24000,
    language_hints: options.languageHints ?? ['zh'],
  }

  if (instruction) {
    input.instruction = instruction
  }

  const response = await fetch(TTS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, input }),
  })

  const raw = await response.text()
  let parsed: CosyVoiceResponse
  try {
    parsed = JSON.parse(raw) as CosyVoiceResponse
  }
  catch {
    throw createError({
      statusCode: response.status || 502,
      message: `CosyVoice 响应解析失败: ${raw.slice(0, 200)}`,
    })
  }

  if (!response.ok || parsed.code) {
    const msg = parsed.message ?? raw
    let hint = msg
    if (msg.includes('428')) {
      hint = `${msg}（instruction 格式与音色/模型不匹配；系统音色请勿使用方言 instruction）`
    }
    else if (msg.includes('418')) {
      hint = `${msg}（v3.5 仅支持声音设计/复刻音色；系统默认音色请用 v3-flash 或配置 COSYVOICE_VOICE）`
    }
    else if (parsed.code === 'Model.AccessDenied') {
      hint = `${msg}（请在百炼控制台开通 CosyVoice 语音合成模型）`
    }
    throw createError({
      statusCode: response.status || 502,
      message: `CosyVoice: ${hint}`,
    })
  }

  const audio = parsed.output?.audio
  if (!audio) {
    throw createError({ statusCode: 502, message: 'CosyVoice: 未返回音频' })
  }

  const format = options.format ?? 'mp3'
  const mimeType = format === 'mp3' ? 'audio/mpeg' : `audio/${format}`

  if (audio.data) {
    return { buffer: Buffer.from(audio.data, 'base64'), mimeType }
  }

  if (audio.url) {
    const audioRes = await fetch(audio.url)
    if (!audioRes.ok) {
      throw createError({ statusCode: 502, message: `CosyVoice 音频下载失败: HTTP ${audioRes.status}` })
    }
    return {
      buffer: Buffer.from(await audioRes.arrayBuffer()),
      mimeType: audioRes.headers.get('content-type') || mimeType,
    }
  }

  throw createError({ statusCode: 502, message: 'CosyVoice: 音频 data/url 均为空' })
}
