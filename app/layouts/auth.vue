<script setup lang="ts">
import { NewsLoader } from '@/components/ui/news-loader'
</script>

<template>
  <div class="aurora-bg min-h-screen flex flex-col items-center justify-center p-4 pb-safe">
    <NewsLoader />
    <div class="relative z-10 w-full max-w-md">
      <slot />
    </div>
  </div>
</template>
