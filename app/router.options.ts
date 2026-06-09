import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, _from, savedPosition) {
    // Supabase magic link hash 不是 DOM 锚点，跳过滚动避免 Vue Router 警告
    if (to.hash?.includes('access_token')) return false
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
}
