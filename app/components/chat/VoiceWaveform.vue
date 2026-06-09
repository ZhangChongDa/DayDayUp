<script setup lang="ts">
/** 与 AI 语音胶囊一致的柱形参数 */
const CAPSULE_TRACK_H = 28
const CAPSULE_BAR_W = 3
const CAPSULE_BAR_GAP = 3
const CAPSULE_MIN_BAR_H = 8
const CAPSULE_MAX_BAR_H = 26

const props = withDefaults(defineProps<{
  levels?: number[]
  tick?: number
  barCount?: number
  variant?: 'brand' | 'neutral' | 'user'
  /** capsule：与 AI 语音输出胶囊同款柱形 */
  density?: 'default' | 'capsule'
  showLead?: boolean
}>(), {
  levels: () => [],
  tick: 0,
  barCount: 20,
  variant: 'neutral',
  density: 'capsule',
  showLead: false,
})

const isCapsule = computed(() => props.density === 'capsule')

const bars = computed(() => {
  void props.tick
  const count = props.barCount
  const src = props.levels ?? []
  if (src.length >= count) {
    return Array.from({ length: count }, (_, i) => src[i] ?? 0.32)
  }
  return Array.from({ length: count }, (_, i) => 0.32 + ((i * 5) % 4) * 0.14)
})

function capsuleBarHeight(level: number): number {
  const clamped = Math.max(0.28, Math.min(1, level))
  return Math.round(CAPSULE_MIN_BAR_H + (CAPSULE_MAX_BAR_H - CAPSULE_MIN_BAR_H) * clamped)
}
</script>

<template>
  <!-- 胶囊款：固定柱宽 + 像素高度，与 AI 输出一致 -->
  <div
    v-if="isCapsule"
    class="voice-capsule-track"
    role="img"
    aria-hidden="true"
  >
    <div
      v-for="(level, i) in bars"
      :key="`${tick}-${i}`"
      class="voice-capsule-bar"
      :class="{
        'voice-capsule-bar--neutral': variant === 'neutral',
        'voice-capsule-bar--user': variant === 'user',
      }"
      :style="{ height: `${capsuleBarHeight(level)}px` }"
    />
  </div>

  <!-- 默认款（品牌渐变） -->
  <div
    v-else
    class="flex h-8 w-full items-center gap-2"
    role="img"
    aria-hidden="true"
  >
    <div
      v-if="showLead"
      class="hidden sm:block h-px flex-1 max-w-[72px] border-t border-dashed border-muted-foreground/35"
    />
    <div class="flex h-8 flex-1 min-w-0 items-end justify-center gap-1">
      <div
        v-for="(level, i) in bars"
        :key="`${tick}-${i}`"
        class="voice-waveform-bar w-1 min-h-[4px] rounded-full transition-[height] duration-150 ease-out"
        :class="{
          'voice-waveform-bar--neutral': variant === 'neutral',
          'voice-waveform-bar--user': variant === 'user',
        }"
        :style="{ height: `${Math.round(level * 100)}%` }"
      />
    </div>
  </div>
</template>

<style scoped>
/* ── 胶囊波形：粗柱、圆头、固定间距（对齐 AssistantVoiceCapsule） ── */
.voice-capsule-track {
  display: inline-flex;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 3px;
  height: 28px;
  flex-shrink: 0;
}

.voice-capsule-bar {
  width: 3px;
  min-height: 8px;
  border-radius: 9999px;
  flex-shrink: 0;
  transition: height 150ms ease-out;
}

.voice-capsule-bar--neutral {
  background: hsl(var(--foreground) / 0.44);
}

.dark .voice-capsule-bar--neutral {
  background: hsl(var(--foreground) / 0.58);
}

.voice-capsule-bar--user {
  background: rgba(6, 95, 70, 0.6);
}

.dark .voice-capsule-bar--user {
  background: rgba(110, 231, 183, 0.7);
}

/* ── 默认渐变款 ── */
.voice-waveform-bar {
  background: linear-gradient(
    to top,
    var(--brand-blue) 0%,
    var(--brand-cyan) 55%,
    var(--brand-teal) 100%
  );
  box-shadow: 0 0 6px color-mix(in srgb, var(--brand-cyan) 35%, transparent);
}

.voice-waveform-bar--neutral {
  background: hsl(var(--muted-foreground) / 0.55);
  box-shadow: none;
}

.voice-waveform-bar--user {
  background: rgba(6, 95, 70, 0.55);
  box-shadow: none;
}
</style>
