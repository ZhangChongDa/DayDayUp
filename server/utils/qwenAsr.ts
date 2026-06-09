/**
 * 千问3-ASR-Flash 语音识别
 * 文档: CodingDoc/Qwen3-ASR-Flash（OpenAI 兼容模式）
 */

import { normalizeStorageMimeType } from './storageMime'
import { BEARKID_MEDIA_BUCKET } from './storageBucket'

const DEFAULT_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1'
const ASR_MODEL = 'qwen3-asr-flash'

export interface QwenAsrOptions {
  language?: string
  enableItn?: boolean
}

interface QwenAsrResponse {
  choices?: Array<{
    message?: { content?: string }
  }>
  error?: { message?: string; code?: string }
}

export function bufferToDataUri(buffer: Buffer, mimeType: string): string {
  const normalized = normalizeStorageMimeType(mimeType, 'audio/webm')
  return `data:${normalized};base64,${buffer.toString('base64')}`
}

/** 从 Supabase Storage 路径读取（Service Role，不依赖公网 URL） */
export async function loadAudioFromStoragePath(storagePath: string): Promise<{ buffer: Buffer; mimeType: string }> {
  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase.storage
    .from(BEARKID_MEDIA_BUCKET)
    .download(storagePath)

  if (error || !data) {
    throw createError({
      statusCode: 400,
      message: `无法从 Storage 读取音频: ${error?.message ?? 'download failed'}`,
    })
  }

  const buffer = Buffer.from(await data.arrayBuffer())
  const mimeType = normalizeStorageMimeType(data.type || 'audio/webm', 'audio/webm')
  return { buffer, mimeType }
}

/** 从公网 URL 拉取音频 */
export async function loadAudioFromUrl(audioUrl: string, mimeType?: string): Promise<{ buffer: Buffer; mimeType: string }> {
  const res = await fetch(audioUrl)
  if (!res.ok) {
    throw createError({ statusCode: 400, message: `无法读取音频文件: HTTP ${res.status}` })
  }

  const buffer = Buffer.from(await res.arrayBuffer())
  const rawMime = mimeType || res.headers.get('content-type') || 'audio/webm'
  return { buffer, mimeType: normalizeStorageMimeType(rawMime, 'audio/webm') }
}

export async function transcribeWithQwenAsr(
  audioInput: string,
  options: QwenAsrOptions = {},
): Promise<{ text: string }> {
  const config = useRuntimeConfig()
  const apiKey = config.qwen3AsrFlashApiKey as string

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: 'Qwen ASR API Key 未配置，请在 .env 设置 QWEN3_ASR_FLASH_API_KEY',
    })
  }

  const baseUrl = (config.qwen3AsrBaseUrl as string) || DEFAULT_BASE_URL

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: ASR_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'input_audio',
              input_audio: { data: audioInput },
            },
          ],
        },
      ],
      stream: false,
      asr_options: {
        language: options.language ?? 'zh',
        enable_itn: options.enableItn ?? true,
      },
    }),
  })

  const raw = await response.text()
  let parsed: QwenAsrResponse
  try {
    parsed = JSON.parse(raw) as QwenAsrResponse
  }
  catch {
    throw createError({
      statusCode: response.status || 502,
      message: `Qwen ASR 响应解析失败: ${raw.slice(0, 200)}`,
    })
  }

  if (!response.ok || parsed.error) {
    const errMsg = parsed.error?.message ?? raw
    const isEmptyAudio = errMsg.includes('audio is empty') || errMsg.includes('音频')
    throw createError({
      statusCode: isEmptyAudio ? 422 : (response.status >= 400 ? response.status : 502),
      message: isEmptyAudio
        ? '录音太短或未录到声音，请按住麦克风至少 1 秒再松开'
        : `Qwen ASR: ${errMsg}`,
    })
  }

  const text = parsed.choices?.[0]?.message?.content?.trim() ?? ''
  if (!text) {
    throw createError({ statusCode: 422, message: '未识别到语音内容，请重新录制' })
  }

  return { text }
}

const MIN_ASR_BYTES = 3500

async function transcribeBuffer(buffer: Buffer, mimeType: string, options?: QwenAsrOptions) {
  const maxBytes = 10 * 1024 * 1024
  if (buffer.length > maxBytes) {
    throw createError({ statusCode: 413, message: '音频超过 Qwen ASR 10MB 限制' })
  }
  if (buffer.length < MIN_ASR_BYTES) {
    throw createError({
      statusCode: 422,
      message: '录音太短或未录到声音，请按住麦克风至少 1 秒再松开',
    })
  }

  const dataUri = bufferToDataUri(buffer, mimeType)
  return transcribeWithQwenAsr(dataUri, options)
}

async function transcribeBufferWithUrlFallback(
  buffer: Buffer,
  mimeType: string,
  publicUrl: string,
  options?: QwenAsrOptions,
) {
  if (buffer.length >= MIN_ASR_BYTES) {
    try {
      return await transcribeWithQwenAsr(publicUrl, options)
    }
    catch {
      return transcribeBuffer(buffer, mimeType, options)
    }
  }
  return transcribeBuffer(buffer, mimeType, options)
}

/** 优先 Storage 路径，其次直传 buffer，最后公网 URL */
export async function transcribeAudioSource(
  source: {
    storagePath?: string
    audioUrl?: string
    buffer?: Buffer
    mimeType?: string
  },
  options?: QwenAsrOptions,
) {
  if (source.buffer) {
    return transcribeBuffer(
      source.buffer,
      source.mimeType || 'audio/webm',
      options,
    )
  }

  if (source.storagePath) {
    const { buffer, mimeType } = await loadAudioFromStoragePath(source.storagePath)
    const { data: pub } = useSupabaseAdmin().storage.from(BEARKID_MEDIA_BUCKET).getPublicUrl(source.storagePath)
    return transcribeBufferWithUrlFallback(buffer, mimeType, pub.publicUrl, options)
  }

  if (source.audioUrl) {
    const { buffer, mimeType } = await loadAudioFromUrl(source.audioUrl, source.mimeType)
    return transcribeBufferWithUrlFallback(buffer, mimeType, source.audioUrl.trim(), options)
  }

  throw createError({ statusCode: 400, message: '请提供 storagePath、audioUrl 或音频文件' })
}

/** @deprecated 使用 transcribeAudioSource */
export async function transcribeAudioUrl(
  audioUrl: string,
  mimeType?: string,
  options?: QwenAsrOptions,
) {
  return transcribeAudioSource({ audioUrl, mimeType }, options)
}
