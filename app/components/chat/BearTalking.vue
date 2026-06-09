<script setup lang="ts">
/**
 * BearTalking — AI 对话中动画（SSE 流式回复时显示）
 * 小熊 + 声波律动条
 * 遵循 prefers-reduced-motion
 */
const props = withDefaults(defineProps<{
  size?: number
}>(), { size: 36 })

const waveHeights = [0.4, 0.8, 1, 0.7, 0.5, 0.9, 0.6]
</script>

<template>
  <div class="flex items-center gap-2 py-1">
    <!-- 小熊头像（对话版：大眼睛+开嘴） -->
    <div class="relative shrink-0">
      <svg
        :width="props.size"
        :height="props.size"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="motion-safe:animate-[bear-breathe_1.5s_ease-in-out_infinite]"
      >
        <ellipse cx="25" cy="30" rx="16" ry="14" class="fill-zinc-900 dark:fill-zinc-50" />
        <ellipse cx="25" cy="31" rx="9" ry="8" class="fill-zinc-300 dark:fill-zinc-600" />
        <ellipse cx="95" cy="30" rx="16" ry="14" class="fill-zinc-900 dark:fill-zinc-50" />
        <ellipse cx="95" cy="31" rx="9" ry="8" class="fill-zinc-300 dark:fill-zinc-600" />
        <circle cx="60" cy="68" r="44" class="fill-zinc-900 dark:fill-zinc-50" />
        <ellipse cx="60" cy="82" rx="20" ry="14" class="fill-zinc-700 dark:fill-zinc-300" />
        <!-- 对话中：大眼睛 -->
        <ellipse cx="46" cy="64" rx="7" ry="8" class="fill-zinc-50 dark:fill-zinc-900" />
        <ellipse cx="47" cy="64" rx="4" ry="5" class="fill-zinc-900 dark:fill-zinc-50" />
        <circle cx="49" cy="62" r="1.5" class="fill-zinc-50 dark:fill-zinc-900" />
        <ellipse cx="74" cy="64" rx="7" ry="8" class="fill-zinc-50 dark:fill-zinc-900" />
        <ellipse cx="73" cy="64" rx="4" ry="5" class="fill-zinc-900 dark:fill-zinc-50" />
        <circle cx="71" cy="62" r="1.5" class="fill-zinc-50 dark:fill-zinc-900" />
        <!-- 开嘴说话 -->
        <ellipse cx="60" cy="78" rx="5" ry="3.5" class="fill-zinc-900 dark:fill-zinc-50" />
        <ellipse cx="60" cy="86" rx="9" ry="6" class="fill-zinc-900 dark:fill-zinc-50" />
        <ellipse cx="60" cy="86" rx="6" ry="4" class="fill-zinc-600 dark:fill-zinc-300" />
        <ellipse cx="36" cy="75" rx="7" ry="4.5" class="fill-zinc-600/30 dark:fill-zinc-300/30" />
        <ellipse cx="84" cy="75" rx="7" ry="4.5" class="fill-zinc-600/30 dark:fill-zinc-300/30" />
      </svg>
    </div>

    <!-- 声波条 -->
    <div class="flex items-center gap-0.5 h-6">
      <span
        v-for="(h, i) in waveHeights"
        :key="i"
        class="w-1 rounded-full bg-gradient-to-t from-blue-500 to-cyan-400 motion-safe:animate-[bear-wave_0.8s_ease-in-out_infinite_alternate]"
        :style="{
          height: '100%',
          transform: `scaleY(${h})`,
          animationDelay: `${i * 0.1}s`,
        }"
      />
    </div>
  </div>
</template>
