/**
 * useChatVoice — 聊天语音输入（听写 / PTT 共用转写逻辑）
 */

import { storageExtFromMime } from '~/lib/storageMime'

export function useChatVoice() {
  const { t } = useI18n()
  const media = useDeviceMedia()
  const isTranscribing = ref(false)
  const voiceError = ref<string | null>(null)

  async function transcribeBlob(blob: Blob): Promise<string> {
    const ext = storageExtFromMime(blob.type)
    const form = new FormData()
    form.append('file', blob, `voice-${Date.now()}.${ext}`)
    form.append('language', 'zh')

    const result = await $fetch<{ text: string }>('/api/chat/transcribe', {
      method: 'POST',
      body: form,
    })

    return result.text.trim()
  }

  async function uploadVoiceBlob(blob: Blob) {
    const ext = storageExtFromMime(blob.type)
    const form = new FormData()
    form.append('file', blob, `voice-${Date.now()}.${ext}`)
    form.append('type', 'audio')

    return $fetch<{ url: string; path: string; name: string; type: string; mimeType?: string }>('/api/chat/upload', {
      method: 'POST',
      body: form,
    })
  }

  function validateRecording(blob: Blob | null, durationMs: number): string | null {
    if (durationMs < media.MIN_RECORDING_MS) return t('chat.voiceTooShort')
    if (!blob || blob.size < media.MIN_RECORDING_BYTES) return t('chat.voiceTooShort')
    return null
  }

  /** 听写模式：结束录音并转写为文字 */
  async function finishDictation(): Promise<string | null> {
    if (!media.isRecording.value) {
      voiceError.value = t('chat.voiceTooShort')
      return null
    }
    const durationMs = media.getRecordingDurationMs()
    const blob = await media.stopRecording()
    const validation = validateRecording(blob, durationMs)
    if (validation) {
      voiceError.value = validation
      return null
    }

    isTranscribing.value = true
    voiceError.value = null
    try {
      const text = await transcribeBlob(blob!)
      if (!text) {
        voiceError.value = t('chat.transcribeEmpty')
        return null
      }
      return text
    }
    catch (e: any) {
      voiceError.value = e?.data?.message ?? e?.message ?? t('chat.uploadFailed')
      return null
    }
    finally {
      isTranscribing.value = false
    }
  }

  /** PTT：松手后转写并返回文字 + 上传信息 */
  async function finishPttAndUpload(): Promise<{
    text: string
    upload: { url: string; name: string }
    durationSec: number
  } | null> {
    const durationMs = media.getRecordingDurationMs()
    const blob = await media.stopRecording()
    const validation = validateRecording(blob, durationMs)
    if (validation) {
      voiceError.value = validation
      return null
    }

    isTranscribing.value = true
    voiceError.value = null
    try {
      const [upload, text] = await Promise.all([
        uploadVoiceBlob(blob!),
        transcribeBlob(blob!),
      ])

      if (!text) {
        voiceError.value = t('chat.transcribeEmpty')
        return null
      }

      return {
        text,
        upload: { url: upload.url, name: upload.name },
        durationSec: Math.max(1, Math.round(durationMs / 1000)),
      }
    }
    catch (e: any) {
      voiceError.value = e?.data?.message ?? e?.message ?? t('chat.uploadFailed')
      return null
    }
    finally {
      isTranscribing.value = false
    }
  }

  function cancelVoice() {
    media.cancelRecording()
    voiceError.value = null
  }

  async function startRecording(options?: { maxDurationMs?: number, onMaxDuration?: () => void }) {
    voiceError.value = null
    await media.startRecording(options)
    if (!media.isRecording.value) {
      voiceError.value = media.error.value ?? t('chat.micUnavailable')
    }
  }

  return {
    isRecording: media.isRecording,
    audioLevels: media.audioLevels,
    levelTick: media.levelTick,
    isTranscribing,
    voiceError,
    startRecording,
    stopRecording: media.stopRecording,
    cancelVoice,
    finishDictation,
    finishPttAndUpload,
    getRecordingDurationMs: media.getRecordingDurationMs,
    getPttRemainingSec: media.getPttRemainingSec,
    MIN_RECORDING_BYTES: media.MIN_RECORDING_BYTES,
    MIN_RECORDING_MS: media.MIN_RECORDING_MS,
    MAX_PTT_MS: media.MAX_PTT_MS,
  }
}
