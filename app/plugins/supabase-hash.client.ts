/**
 * 兼容旧 magic link：从 URL hash 手动建立 session
 */
export default defineNuxtPlugin(async () => {
  if (!import.meta.client) return

  const hash = window.location.hash
  if (!hash || !hash.includes('access_token')) return

  const supabase = useSupabaseClient()
  const params = new URLSearchParams(hash.substring(1))
  const access_token = params.get('access_token')
  const refresh_token = params.get('refresh_token')

  if (access_token && refresh_token) {
    await supabase.auth.setSession({ access_token, refresh_token })
  }

  history.replaceState(null, '', window.location.pathname)

  if (window.location.pathname !== '/auth/callback') {
    await navigateTo('/auth/callback')
  }
})
