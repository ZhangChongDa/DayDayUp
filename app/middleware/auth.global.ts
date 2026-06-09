/**
 * 全局路由守卫
 * 支持两种会话：
 *   1. 家长 Supabase JWT
 *   2. 孩子 PIN cookie（active_student_profile_id）
 */
export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  const activeProfileId = useCookie<string | null>('active_student_profile_id')

  const publicRoutes = ['/login', '/select-role', '/auth/callback']
  const parentRoutes = ['/parent']
  const childSessionRoutes = ['/onboarding', '/chat']

  const isPublic = publicRoutes.some(p => to.path.startsWith(p))
  const isParent = parentRoutes.some(p => to.path.startsWith(p))
  const isChildSession = childSessionRoutes.some(p => to.path.startsWith(p))

  // 孩子 PIN 已解锁：允许访问 onboarding / chat（无需家长 JWT）
  if (!user.value && isChildSession && activeProfileId.value) return

  if (!user.value && !isPublic) {
    return navigateTo('/login')
  }

  if (user.value) {
    if (to.path === '/login') return

    if (isParent) return

    const childAllowed = ['/select-role', '/auth/callback', '/onboarding', '/chat']
    const isChildRoute = childAllowed.some(p => to.path.startsWith(p))

    if (!activeProfileId.value && !isChildRoute && !isParent) {
      return navigateTo('/select-role')
    }
  }
})
