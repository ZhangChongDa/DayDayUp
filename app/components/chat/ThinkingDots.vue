<script setup lang="ts">
defineProps<{
  label?: string
}>()
</script>

<template>
  <div class="flex items-center gap-2 py-0.5">
    <div class="flex items-center gap-1">
      <span
        v-for="i in 3"
        :key="i"
        class="block h-2 w-2 rounded-full bg-muted-foreground/55 motion-safe:animate-[bear-dot-bounce_1.2s_ease-in-out_infinite]"
        :style="{ animationDelay: `${(i - 1) * 0.2}s` }"
      />
    </div>
    <span v-if="label" class="text-sm text-muted-foreground">{{ label }}</span>
  </div>
</template>
