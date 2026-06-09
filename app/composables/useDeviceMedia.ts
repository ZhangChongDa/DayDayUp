/**
 * useDeviceMedia — 硬件媒体能力抽象层（单例，保证波形响应性）
 */

import { createSharedComposable } from '@vueuse/core'
import { normalizeStorageMimeType } from '~/lib/storageMime'

export const MIN_RECORDING_BYTES = 3500
export const MIN_RECORDING_MS = 1000
export const MAX_PTT_MS = 60_000
/** 与 AI 语音输出胶囊一致：20 根柱 */
export const WAVEFORM_BAR_COUNT = 20

/** 波形刷新间隔（ms），降低抖动频率 */
const LEVEL_UPDATE_INTERVAL_MS = 90
const LEVEL_SMOOTHING = 0.22
const LEVEL_DECAY = 0.78
const LEVEL_GAIN = 1.35
/** 静音基线抬高，保证柱形始终可见（对齐输出胶囊静态波形） */
const LEVEL_MIN = 0.26
const LEVEL_MAX = 0.82

const BT_INPUT_RE = /bluetooth|airpods|headset|headphone|earbud|耳机|无线|hands.?free/i

type AudioConstraintSet = MediaTrackConstraints

function _useDeviceMedia() {
  const isRecording = ref(false)
  const audioBlob = ref<Blob | null>(null)
  const audioUrl = ref<string | null>(null)
  const error = ref<string | null>(null)
  const audioLevels = ref<number[]>(Array(WAVEFORM_BAR_COUNT).fill(LEVEL_MIN))
  const levelTick = ref(0)

  let mediaRecorder: MediaRecorder | null = null
  let chunks: BlobPart[] = []
  let stream: MediaStream | null = null
  let recordingStartedAt = 0
  let audioContext: AudioContext | null = null
  let analyser: AnalyserNode | null = null
  let levelFrameId: number | null = null
  let lastLevelUpdateAt = 0
  let smoothedLevel = LEVEL_MIN
  let maxDurationTimer: ReturnType<typeof setTimeout> | null = null
  let onMaxDurationCallback: (() => void) | null = null

  function pickAudioMimeType(): string {
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus',
      'audio/ogg',
    ]
    for (const mime of candidates) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mime)) {
        return mime
      }
    }
    return 'audio/webm'
  }

  function toStorageBlob(parts: BlobPart[], recordMime: string): Blob {
    const storageMime = normalizeStorageMimeType(recordMime, 'audio/webm')
    return new Blob(parts, { type: storageMime })
  }

  function resetAudioLevels() {
    smoothedLevel = LEVEL_MIN
    audioLevels.value = Array(WAVEFORM_BAR_COUNT).fill(LEVEL_MIN)
    levelTick.value++
  }

  function clearMaxDurationTimer() {
    if (maxDurationTimer) {
      clearTimeout(maxDurationTimer)
      maxDurationTimer = null
    }
    onMaxDurationCallback = null
  }

  function stopLevelMonitor() {
    if (levelFrameId !== null) {
      cancelAnimationFrame(levelFrameId)
      levelFrameId = null
    }
    lastLevelUpdateAt = 0
    analyser = null
    if (audioContext) {
      audioContext.close().catch(() => {})
      audioContext = null
    }
    resetAudioLevels()
  }

  function buildBarLevels(globalLevel: number): number[] {
    const voiceBoost = Math.max(0, (globalLevel - LEVEL_MIN) / (LEVEL_MAX - LEVEL_MIN))
    return Array.from({ length: WAVEFORM_BAR_COUNT }, (_, i) => {
      // 与输出胶囊静态波形同款高低错落（0.32 / 0.46 / 0.60 / 0.74）
      const base = 0.32 + ((i * 5) % 4) * 0.14
      const scaled = base + voiceBoost * 0.24
      return Math.max(0.32, Math.min(0.96, scaled))
    })
  }

  function startLevelMonitor(mediaStream: MediaStream) {
    stopLevelMonitor()
    if (typeof window === 'undefined') return

    const ctx = new AudioContext()
    audioContext = ctx
    const source = ctx.createMediaStreamSource(mediaStream)
    const node = ctx.createAnalyser()
    node.fftSize = 512
    node.smoothingTimeConstant = 0.88
    source.connect(node)
    analyser = node

    const timeData = new Uint8Array(node.fftSize)

    const tick = (timestamp: number) => {
      if (!analyser || !isRecording.value) return

      if (timestamp - lastLevelUpdateAt < LEVEL_UPDATE_INTERVAL_MS) {
        levelFrameId = requestAnimationFrame(tick)
        return
      }
      lastLevelUpdateAt = timestamp

      analyser.getByteTimeDomainData(timeData)

      let sumSquares = 0
      for (let i = 0; i < timeData.length; i++) {
        const sample = ((timeData[i] ?? 128) - 128) / 128
        sumSquares += sample * sample
      }
      const rms = Math.sqrt(sumSquares / timeData.length)

      const raw = Math.max(LEVEL_MIN, Math.min(LEVEL_MAX, LEVEL_MIN + rms * LEVEL_GAIN))
      smoothedLevel = smoothedLevel * LEVEL_DECAY + raw * LEVEL_SMOOTHING

      audioLevels.value = buildBarLevels(smoothedLevel)
      levelTick.value++
      levelFrameId = requestAnimationFrame(tick)
    }

    void ctx.resume().then(() => requestAnimationFrame(tick)).catch(() => requestAnimationFrame(tick))
  }

  async function ensureDeviceLabels(): Promise<void> {
    if (!navigator.mediaDevices?.enumerateDevices) return
    const devices = await navigator.mediaDevices.enumerateDevices()
    const needsPermission = devices.some(d => d.kind === 'audioinput' && !d.label)
    if (!needsPermission) return
    const probe = await navigator.mediaDevices.getUserMedia({ audio: true })
    probe.getTracks().forEach(t => t.stop())
  }

  async function findBluetoothInputId(): Promise<string | null> {
    if (!navigator.mediaDevices?.enumerateDevices) return null
    try {
      await ensureDeviceLabels()
      const devices = await navigator.mediaDevices.enumerateDevices()
      const inputs = devices.filter(d => d.kind === 'audioinput' && d.deviceId)
      const bt = inputs.find(d => BT_INPUT_RE.test(d.label))
      return bt?.deviceId ?? null
    }
    catch {
      return null
    }
  }

  function buildConstraintAttempts(btDeviceId: string | null): AudioConstraintSet[] {
    const base: AudioConstraintSet = {
      channelCount: 1,
      autoGainControl: { ideal: true },
      // 蓝牙耳机在开启回声消除时经常被系统静音，优先关闭
      echoCancellation: { ideal: false },
      noiseSuppression: { ideal: false },
    }

    const attempts: AudioConstraintSet[] = []

    if (btDeviceId) {
      attempts.push({ ...base, deviceId: { exact: btDeviceId } })
      attempts.push({ ...base, deviceId: { ideal: btDeviceId } })
    }

    attempts.push(
      { ...base },
      {
        channelCount: 1,
        echoCancellation: { ideal: true },
        noiseSuppression: { ideal: true },
        autoGainControl: { ideal: true },
      },
      { channelCount: 1 },
      {},
    )

    return attempts
  }

  async function acquireAudioStream(): Promise<MediaStream> {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('当前浏览器不支持麦克风')
    }

    let btDeviceId: string | null = null
    try {
      btDeviceId = await findBluetoothInputId()
    }
    catch {
      btDeviceId = null
    }

    const attempts = buildConstraintAttempts(btDeviceId)
    let lastError: Error | null = null

    for (const audio of attempts) {
      try {
        const candidate = await navigator.mediaDevices.getUserMedia({ audio })
        const track = candidate.getAudioTracks()[0]
        if (track?.readyState === 'live') {
          return candidate
        }
        candidate.getTracks().forEach(t => t.stop())
      }
      catch (e: any) {
        lastError = e instanceof Error ? e : new Error(e?.message ?? '麦克风不可用')
      }
    }

    throw lastError ?? new Error('无法访问麦克风，请检查权限或音频设备')
  }

  function cleanupStream() {
    clearMaxDurationTimer()
    stopLevelMonitor()
    stream?.getTracks().forEach(t => t.stop())
    stream = null
  }

  async function startRecording(options?: { maxDurationMs?: number, onMaxDuration?: () => void }) {
    error.value = null
    audioBlob.value = null
    audioUrl.value = null
    chunks = []
    recordingStartedAt = Date.now()
    clearMaxDurationTimer()

    if (options?.maxDurationMs && options.onMaxDuration) {
      onMaxDurationCallback = options.onMaxDuration
      maxDurationTimer = setTimeout(() => {
        if (isRecording.value) onMaxDurationCallback?.()
      }, options.maxDurationMs)
    }

    try {
      stream = await acquireAudioStream()
      const mimeType = pickAudioMimeType()
      mediaRecorder = new MediaRecorder(stream, { mimeType })

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      mediaRecorder.start(250)
      isRecording.value = true
      startLevelMonitor(stream)
    }
    catch (e: any) {
      error.value = e.message ?? '麦克风权限被拒绝'
      recordingStartedAt = 0
      cleanupStream()
    }
  }

  function getRecordingDurationMs() {
    return recordingStartedAt > 0 ? Date.now() - recordingStartedAt : 0
  }

  function getPttRemainingSec(maxSec = 60) {
    const elapsed = Math.floor(getRecordingDurationMs() / 1000)
    return Math.max(0, maxSec - elapsed)
  }

  function stopRecording(): Promise<Blob | null> {
    return new Promise((resolve) => {
      clearMaxDurationTimer()

      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        isRecording.value = false
        resolve(null)
        return
      }

      const recordMime = mediaRecorder.mimeType || pickAudioMimeType()

      mediaRecorder.onstop = () => {
        const blob = toStorageBlob(chunks, recordMime)
        audioBlob.value = blob
        audioUrl.value = URL.createObjectURL(blob)
        chunks = []
        cleanupStream()
        isRecording.value = false
        recordingStartedAt = 0
        resolve(blob.size > 0 ? blob : null)
      }

      try {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.requestData()
        }
      }
      catch { /* ignore */ }

      mediaRecorder.stop()
    })
  }

  function cancelRecording() {
    clearMaxDurationTimer()
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.ondataavailable = null
      mediaRecorder.onstop = null
      try {
        mediaRecorder.stop()
      }
      catch { /* ignore */ }
    }
    cleanupStream()
    isRecording.value = false
    chunks = []
    recordingStartedAt = 0
  }

  onUnmounted(() => {
    cancelRecording()
    if (audioUrl.value) URL.revokeObjectURL(audioUrl.value)
  })

  return {
    isRecording,
    audioBlob,
    audioUrl,
    audioLevels,
    levelTick,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
    getRecordingDurationMs,
    getPttRemainingSec,
    MIN_RECORDING_BYTES,
    MIN_RECORDING_MS,
    MAX_PTT_MS,
    WAVEFORM_BAR_COUNT,
  }
}

export const useDeviceMedia = createSharedComposable(_useDeviceMedia)
