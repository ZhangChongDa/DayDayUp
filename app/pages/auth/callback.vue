<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const errorMsg = ref('')

async function establishSessionFromHash() {
  const hash = window.location.hash
  if (!hash?.includes('access_token')) return false

  const params = new URLSearchParams(hash.substring(1))
  const access_token = params.get('access_token')
  const refresh_token = params.get('refresh_token')
  if (!access_token || !refresh_token) return false

  const { error } = await supabase.auth.setSession({ access_token, refresh_token })
  if (error) return false

  history.replaceState(null, '', window.location.pathname)
  return true
}

async function waitForSession(maxMs = 8000) {
  await establishSessionFromHash()

  const start = Date.now()
  while (!user.value && Date.now() - start < maxMs) {
    await supabase.auth.getSession()
    await new Promise(r => setTimeout(r, 200))
  }
}

onMounted(async () => {
  await waitForSession()

  if (!user.value) {
    errorMsg.value = '登录会话建立失败，请重新获取验证码'
    setTimeout(() => navigateTo('/login'), 2000)
    return
  }

  try {
    const { next } = await $fetch<{ next: string }>('/api/auth/next-step')
    await navigateTo(next)
  }
  catch {
    await navigateTo('/parent')
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 py-12">
    <BearThinking v-if="!errorMsg" label="登录中..." />
    <p v-else class="text-sm text-destructive text-center">{{ errorMsg }}</p>
  </div>
</template>
