<script setup lang="ts">
/**
 * NewsLoader — 页面跳转/加载进度条
 * 工程规范组件：仿 YouTube 顶部进度条，路由切换时显示
 */
import { useLoadingIndicator } from '#imports'

const { isLoading, progress } = useLoadingIndicator()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isLoading"
      class="fixed top-0 left-0 right-0 z-[9999] h-0.5 overflow-hidden"
    >
      <div
        class="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 transition-all duration-300 ease-out"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </Teleport>
</template>
