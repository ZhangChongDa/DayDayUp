<script setup lang="ts">
import { capsuleWidthFromDuration, formatAudioDuration } from '~/composables/useAudioPlayer'

const props = withDefaults(defineProps<{
  audioUrl: string
  align?: 'left' | 'right'
  /** 已知时长（秒），无则加载音频后读取 */
  durationSec?: number
}>(), {
  align: 'right',
})

const player = useAudioPlayer()
const loadedDuration = ref(props.durationSec ?? 0)

const displayDuration = computed(() => {
  if (player.isPlaying.value) return player.currentTime.value
  return loadedDuration.value || player.duration.value
})

const capsuleWidth = computed(() => capsuleWidthFromDuration(loadedDuration.value || player.duration.value || 3))

const waveformLevels = computed(() => {
  if (player.isPlaying.value) return player.playbackLevels.value
  // 静态装饰波形（微信/WhatsApp 未播放态）
  return Array.from({ length: 20 }, (_, i) => 0.32 + ((i * 5) % 4) * 0.14)
})

onMounted(async () => {
  if (props.durationSec && props.durationSec > 0) return
  try {
    const audio = new Audio(props.audioUrl)
    audio.preload = 'metadata'
    audio.addEventListener('loadedmetadata', () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        loadedDuration.value = audio.duration
      }
    }, { once: true })
    audio.load()
  }
  catch { /* ignore */ }
})

async function togglePlay() {
  if (player.isPlaying.value) {
    player.stop()
    return
  }
  await player.playUrl(props.audioUrl)
  if (!loadedDuration.value && player.duration.value) {
    loadedDuration.value = player.duration.value
  }
}
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center gap-2.5 rounded-[20px] px-3 py-2.5 transition-colors select-none touch-manipulation"
    :class="align === 'right'
      ? 'bg-[#d9fdd3] dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-50'
      : 'bg-muted text-foreground'"
    :style="{ width: `${capsuleWidth}px` }"
    @click="togglePlay"
  >
    <span
      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
      :class="align === 'right' ? 'bg-emerald-600/15 dark:bg-emerald-400/20' : 'bg-background/80'"
    >
      <AppIcon
        :icon="player.isPlaying.value ? 'lucide:pause' : 'lucide:play'"
        :size="16"
        class="ml-0.5"
      />
    </span>

    <VoiceWaveform
      :levels="waveformLevels"
      :bar-count="20"
      :variant="align === 'right' ? 'user' : 'neutral'"
      density="capsule"
      class="flex-1 min-w-0"
    />

    <span class="shrink-0 text-[11px] tabular-nums opacity-80 min-w-[34px] text-right">
      {{ formatAudioDuration(displayDuration) }}
    </span>
  </button>
</template>
