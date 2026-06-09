/**
 * useChatTts — AI 回复文字转语音播放（CosyVoice）
 */

const TTS_BAR_COUNT = 20

export function useChatTts() {
  const isSpeaking = ref(false)
  const speakingMessageId = ref<string | null>(null)
  const ttsError = ref<string | null>(null)
  const duration = ref(0)
  const currentTime = ref(0)
  const playbackLevels = ref<number[]>(Array(TTS_BAR_COUNT).fill(0.22))

  let audioEl: HTMLAudioElement | null = null
  let objectUrl: string | null = null
  let audioContext: AudioContext | null = null
  let levelFrameId: number | null = null

  function stopLevelMonitor() {
    if (levelFrameId !== null) {
      cancelAnimationFrame(levelFrameId)
      levelFrameId = null
    }
    if (audioContext) {
      audioContext.close().catch(() => {})
      audioContext = null
    }
    playbackLevels.value = Array(TTS_BAR_COUNT).fill(0.22)
  }

  function startLevelMonitor(el: HTMLAudioElement) {
    stopLevelMonitor()
    if (typeof window === 'undefined') return

    try {
      const ctx = new AudioContext()
      audioContext = ctx
      const source = ctx.createMediaElementSource(el)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 128
      analyser.smoothingTimeConstant = 0.78
      source.connect(analyser)
      analyser.connect(ctx.destination)

      const freqData = new Uint8Array(analyser.frequencyBinCount)

      const tick = () => {
        if (!isSpeaking.value) return
        analyser.getByteFrequencyData(freqData)
        const step = Math.max(1, Math.floor(freqData.length / TTS_BAR_COUNT))
        const next: number[] = []
        for (let i = 0; i < TTS_BAR_COUNT; i++) {
          let sum = 0
          const start = i * step
          for (let j = 0; j < step; j++) sum += freqData[start + j] ?? 0
          const avg = sum / step / 255
          next.push(Math.max(0.18, Math.min(1, 0.18 + avg * 2.4)))
        }
        playbackLevels.value = next
        levelFrameId = requestAnimationFrame(tick)
      }

      ctx.resume().then(tick).catch(tick)
    }
    catch {
      const tick = () => {
        if (!isSpeaking.value) return
        const progress = duration.value > 0 ? currentTime.value / duration.value : 0
        playbackLevels.value = Array.from({ length: TTS_BAR_COUNT }, (_, i) => {
          const phase = (progress * 8 + i * 0.35) % 1
          return 0.2 + Math.sin(phase * Math.PI) * 0.45
        })
        levelFrameId = requestAnimationFrame(tick)
      }
      tick()
    }
  }

  function cleanup() {
    stopLevelMonitor()
    if (audioEl) {
      audioEl.onended = null
      audioEl.onerror = null
      audioEl.ontimeupdate = null
      audioEl.onloadedmetadata = null
      audioEl.pause()
      audioEl = null
    }
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl)
      objectUrl = null
    }
    isSpeaking.value = false
    speakingMessageId.value = null
    currentTime.value = 0
  }

  function stop() {
    cleanup()
  }

  async function speak(text: string, messageId?: string) {
    const trimmed = text.trim()
    if (!trimmed) return

    stop()
    ttsError.value = null
    isSpeaking.value = true
    speakingMessageId.value = messageId ?? null
    duration.value = 0
    currentTime.value = 0

    try {
      const blob = await $fetch<Blob>('/api/chat/tts', {
        method: 'POST',
        body: { text: trimmed },
        responseType: 'blob',
      })

      objectUrl = URL.createObjectURL(blob)
      audioEl = new Audio(objectUrl)

      await new Promise<void>((resolve, reject) => {
        if (!audioEl) return reject(new Error('Audio init failed'))

        audioEl.onloadedmetadata = () => {
          duration.value = Number.isFinite(audioEl!.duration) ? audioEl!.duration : 0
        }
        audioEl.ontimeupdate = () => {
          currentTime.value = audioEl?.currentTime ?? 0
        }
        audioEl.onended = () => resolve()
        audioEl.onerror = () => reject(new Error('Audio playback failed'))

        startLevelMonitor(audioEl)
        audioEl.play().catch(reject)
      })
    }
    catch (e: any) {
      let detail = e?.data?.message ?? e?.message ?? 'TTS failed'
      if (e?.data instanceof Blob) {
        try {
          const json = JSON.parse(await e.data.text())
          detail = json?.message ?? json?.statusMessage ?? detail
        }
        catch { /* keep default */ }
      }
      ttsError.value = detail
    }
    finally {
      cleanup()
    }
  }

  onUnmounted(() => {
    stop()
  })

  return {
    isSpeaking: readonly(isSpeaking),
    speakingMessageId: readonly(speakingMessageId),
    ttsError,
    duration: readonly(duration),
    currentTime: readonly(currentTime),
    playbackLevels: readonly(playbackLevels),
    speak,
    stop,
  }
}
