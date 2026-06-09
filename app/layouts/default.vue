<script setup lang="ts">
import { NewsLoader } from '@/components/ui/news-loader'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground antialiased">
    <NewsLoader />
    <slot />
  </div>
</template>
