<script setup lang="ts">
const user = useSupabaseUser()

if (!user.value) {
  await navigateTo('/login')
}
else {
  try {
    const { next } = await $fetch<{ next: string }>('/api/auth/next-step')
    await navigateTo(next)
  }
  catch {
    await navigateTo('/parent')
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <BearThinking />
  </div>
</template>
