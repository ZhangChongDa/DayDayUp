<script setup lang="ts">
const colorMode = useColorMode()

// SSR 与客户端主题值可能不同，挂载后才渲染，避免 hydration mismatch
const mounted = ref(false)
onMounted(() => { mounted.value = true })

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button
    class="h-8 w-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
    :title="mounted ? (colorMode.value === 'dark' ? 'Light mode' : 'Dark mode') : 'Toggle theme'"
    @click="toggleTheme"
  >
    <!-- 挂载前占位，挂载后显示真实图标，彻底消除 hydration mismatch -->
    <template v-if="mounted">
      <span class="text-sm">{{ colorMode.value === 'dark' ? '☀️' : '🌙' }}</span>
    </template>
    <span v-else class="text-sm opacity-0">🌙</span>
  </button>
</template>
