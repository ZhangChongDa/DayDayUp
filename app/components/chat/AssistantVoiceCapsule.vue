<script setup lang="ts">
import { capsuleWidthFromDuration, formatAudioDuration } from '~/composables/useAudioPlayer'

const props = defineProps<{
  messageId: string
  text: string
  isActive: boolean
  duration: number
  currentTime: number
  levels: number[]
}>()

const emit = defineEmits<{
  play: []
  pause: []
}>()

const capsuleWidth = computed(() => capsuleWidthFromDuration(props.duration || estimateDuration(props.text)))

function estimateDuration(text: string): number {
  return Math.min(90, Math.max(3, Math.ceil(text.length / 12)))
}

const waveformLevels = computed(() => {
  if (props.isActive) return props.levels
  return Array.from({ length: 20 }, (_, i) => 0.32 + ((i * 5) % 4) * 0.14)
})

const displayTime = computed(() => {
  if (props.isActive) return props.currentTime
  return props.duration || estimateDuration(props.text)
})

function handleToggle() {
  if (props.isActive) emit('pause')
  else emit('play')
}
</script>

<template>
  <div
    class="inline-flex items-center gap-2.5 rounded-[20px] bg-muted px-3 py-2.5 text-foreground"
    :style="{ width: `${capsuleWidth}px` }"
  >
    <button
      type="button"
      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background/80 hover:bg-background transition-colors"
      @click.stop="handleToggle"
    >
      <AppIcon :icon="isActive ? 'lucide:pause' : 'lucide:volume-2'" :size="16" />
    </button>

    <button
      type="button"
      class="flex flex-1 min-w-0 items-center h-7"
      @click="handleToggle"
    >
      <VoiceWaveform
        :levels="waveformLevels"
        :bar-count="20"
        variant="neutral"
        density="capsule"
        class="w-full"
      />
    </button>

    <span class="shrink-0 text-[11px] tabular-nums text-muted-foreground min-w-[34px] text-right">
      {{ formatAudioDuration(displayTime) }}
    </span>
  </div>
</template>
