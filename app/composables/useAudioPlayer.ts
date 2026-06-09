/**
 * useAudioPlayer — 音频播放 + 实时波形 + 时长
 */

const PLAYBACK_BAR_COUNT = 20

export function formatAudioDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.max(0, Math.round(seconds))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function capsuleWidthFromDuration(seconds: number): number {
  if (!Number.isFinite(seconds) || seconds <= 0) return 148
  return Math.min(280, Math.max(132, Math.round(120 + seconds * 14)))
}

export function useAudioPlayer() {
  const isPlaying = ref(false)
  const duration = ref(0)
  const currentTime = ref(0)
  const playbackLevels = ref<number[]>(Array(PLAYBACK_BAR_COUNT).fill(0.22))
  const error = ref<string | null>(null)

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
    playbackLevels.value = Array(PLAYBACK_BAR_COUNT).fill(0.22)
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
        if (!isPlaying.value) return
        analyser.getByteFrequencyData(freqData)
        const step = Math.max(1, Math.floor(freqData.length / PLAYBACK_BAR_COUNT))
        const next: number[] = []
        for (let i = 0; i < PLAYBACK_BAR_COUNT; i++) {
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
      // 部分环境禁止 MediaElementSource，用进度驱动伪波形
      const tick = () => {
        if (!isPlaying.value) return
        const progress = duration.value > 0 ? currentTime.value / duration.value : 0
        playbackLevels.value = Array.from({ length: PLAYBACK_BAR_COUNT }, (_, i) => {
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
    isPlaying.value = false
    currentTime.value = 0
  }

  function stop() {
    cleanup()
  }

  async function playUrl(url: string) {
    stop()
    error.value = null
    isPlaying.value = true

    try {
      audioEl = new Audio(url)
      audioEl.crossOrigin = 'anonymous'

      await new Promise<void>((resolve, reject) => {
        if (!audioEl) return reject(new Error('Audio init failed'))

        audioEl.onloadedmetadata = () => {
          duration.value = Number.isFinite(audioEl!.duration) ? audioEl!.duration : 0
        }
        audioEl.ontimeupdate = () => {
          currentTime.value = audioEl?.currentTime ?? 0
        }
        audioEl.onended = () => resolve()
        audioEl.onerror = () => reject(new Error('Playback failed'))

        startLevelMonitor(audioEl)
        audioEl.play().catch(reject)
      })
    }
    catch (e: any) {
      error.value = e?.message ?? 'Playback failed'
    }
    finally {
      cleanup()
    }
  }

  async function playBlob(blob: Blob) {
    objectUrl = URL.createObjectURL(blob)
    await playUrl(objectUrl)
  }

  onUnmounted(() => stop())

  return {
    isPlaying: readonly(isPlaying),
    duration: readonly(duration),
    currentTime: readonly(currentTime),
    playbackLevels: readonly(playbackLevels),
    error: readonly(error),
    playUrl,
    playBlob,
    stop,
    PLAYBACK_BAR_COUNT,
  }
}
