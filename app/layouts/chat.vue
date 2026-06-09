<script setup lang="ts">
import { NewsLoader } from '@/components/ui/news-loader'
</script>

<template>
  <div class="h-dvh flex flex-col bg-background app-aurora-subtle overflow-hidden">
    <NewsLoader />
    <div class="flex flex-1 flex-col min-h-0 overflow-hidden">
      <slot />
    </div>
  </div>
</template>
