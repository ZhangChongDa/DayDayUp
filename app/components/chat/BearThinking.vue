<script setup lang="ts">
/**
 * BearThinking — AI 思考中动画
 * 小熊 + 三个呼吸弹跳点，100ms 内出现
 * 遵循 prefers-reduced-motion
 */
defineProps<{
  label?: string
  size?: number
}>()
</script>

<template>
  <div class="flex items-center gap-2 py-1">
    <!-- 小熊头像（思考版：眼睛半眯） -->
    <div class="relative shrink-0">
      <svg
        :width="size ?? 36"
        :height="size ?? 36"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="motion-safe:animate-[bear-breathe_2.5s_ease-in-out_infinite]"
      >
        <ellipse cx="25" cy="30" rx="16" ry="14" class="fill-zinc-900 dark:fill-zinc-50" />
        <ellipse cx="25" cy="31" rx="9" ry="8" class="fill-zinc-300 dark:fill-zinc-600" />
        <ellipse cx="95" cy="30" rx="16" ry="14" class="fill-zinc-900 dark:fill-zinc-50" />
        <ellipse cx="95" cy="31" rx="9" ry="8" class="fill-zinc-300 dark:fill-zinc-600" />
        <circle cx="60" cy="68" r="44" class="fill-zinc-900 dark:fill-zinc-50" />
        <ellipse cx="60" cy="82" rx="20" ry="14" class="fill-zinc-700 dark:fill-zinc-300" />
        <!-- 思考中：眼睛半眯（弯弧线） -->
        <path d="M40 63 Q46 58 52 63" stroke-width="3" stroke-linecap="round" class="stroke-zinc-50 dark:stroke-zinc-900 fill-none" />
        <path d="M68 63 Q74 58 80 63" stroke-width="3" stroke-linecap="round" class="stroke-zinc-50 dark:stroke-zinc-900 fill-none" />
        <ellipse cx="60" cy="78" rx="5" ry="3.5" class="fill-zinc-900 dark:fill-zinc-50" />
        <path d="M52 84 Q60 89 68 84" stroke-width="2.5" stroke-linecap="round" class="stroke-zinc-50 dark:stroke-zinc-900 fill-none" />
        <ellipse cx="36" cy="75" rx="7" ry="4.5" class="fill-zinc-600/30 dark:fill-zinc-300/30" />
        <ellipse cx="84" cy="75" rx="7" ry="4.5" class="fill-zinc-600/30 dark:fill-zinc-300/30" />
      </svg>
    </div>

    <!-- 弹跳点点 -->
    <div class="flex items-center gap-1">
      <span
        v-for="i in 3"
        :key="i"
        class="block h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500 motion-safe:animate-[bear-dot-bounce_1.2s_ease-in-out_infinite]"
        :style="{ animationDelay: `${(i - 1) * 0.2}s` }"
      />
    </div>

    <span
      v-if="label"
      class="text-xs text-muted-foreground"
    >{{ label }}</span>
  </div>
</template>
