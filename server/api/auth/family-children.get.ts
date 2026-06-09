/**
 * GET /api/auth/family-children
 * 孩子端选角色：无需家长登录，通过 family_tenant_id cookie 读取本家庭孩子列表
 * （家长首次登录后由 verify-otp 写入该 cookie，家庭平板场景）
 */
export default defineEventHandler(async (event) => {
  const tenantId = getCookie(event, 'family_tenant_id')

  if (!tenantId) {
    return { children: [], needsParentSetup: true }
  }

  const supabase = useSupabaseAdmin()

  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, display_name, avatar_emoji, grade')
    .eq('tenant_id', tenantId)
    .eq('role', 'student')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { children: data ?? [], needsParentSetup: false }
})
