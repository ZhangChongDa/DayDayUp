<script setup lang="ts">
/**
 * DayDayUp 品牌 Logo
 * 使用 public/brand/daydayup-logo.png
 */
const props = withDefaults(defineProps<{
  size?: number | string
  animated?: boolean
  class?: string
}>(), {
  size: 48,
  animated: true,
})

const logoSrc = '/brand/daydayup-logo.png'
</script>

<template>
  <img
    :src="logoSrc"
    :width="size"
    :height="size"
    :class="[
      'rounded-full object-cover select-none',
      animated && 'motion-safe:animate-[bear-breathe_3s_ease-in-out_infinite]',
      props.class,
    ]"
    alt="DayDayUp Logo"
    role="img"
    draggable="false"
  >
</template>
