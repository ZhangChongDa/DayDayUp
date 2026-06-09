<script setup lang="ts">
/**
 * FlowButton — 异步操作按钮
 * 工程规范组件：loading 态自带动画，disabled 防重复提交
 */
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import type { ButtonVariants } from '@/components/ui/button'

const props = withDefaults(defineProps<{
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: string
  loading?: boolean
  disabled?: boolean
}>(), {
  variant: 'default',
  size: 'default',
  loading: false,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

function handleClick(event: MouseEvent) {
  if (props.loading || props.disabled) return
  emit('click', event)
}
</script>

<template>
  <button
    :class="cn(buttonVariants({ variant, size }), 'relative', props.class)"
    :disabled="loading || disabled"
    @click="handleClick"
  >
    <span
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center"
    >
      <span class="flex gap-1">
        <span
          v-for="i in 3"
          :key="i"
          class="h-1.5 w-1.5 rounded-full bg-current"
          :style="{
            animation: 'bear-dot-bounce 1.2s ease-in-out infinite',
            animationDelay: `${(i - 1) * 0.2}s`,
          }"
        />
      </span>
    </span>
    <span :class="['contents transition-opacity', loading ? 'opacity-0' : 'opacity-100']">
      <slot />
    </span>
  </button>
</template>
