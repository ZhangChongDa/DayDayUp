/**
 * GET /api/auth/next-step
 * 登录后智能路由（支持家长 session 或孩子 PIN cookie）
 */
export default defineEventHandler(async (event) => {
  const supabase = useSupabaseAdmin()
  const activeStudentId = getCookie(event, 'active_student_profile_id')

  // ── 孩子已 PIN 解锁（无需家长 JWT）──────────────────────────────
  if (activeStudentId) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('ai_config')
      .eq('id', activeStudentId)
      .single()

    const aiConfig = profile?.ai_config as { onboarding_done?: boolean } | null
    const needsOnboarding = !aiConfig?.onboarding_done

    return { next: needsOnboarding ? '/onboarding' : '/chat' }
  }

  // ── 家长 session 流程 ───────────────────────────────────────────
  const user = await requireAuthUser(event)

  const tenantId = await getParentTenantForUser(user.id, user.email)

  const { count } = await supabase
    .from('user_profiles')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)
    .eq('role', 'student')
    .eq('is_active', true)

  if (!count || count === 0) {
    return { next: '/parent' }
  }

  return { next: '/select-role' }
})
