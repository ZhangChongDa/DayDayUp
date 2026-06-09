/**
 * GET /api/parent/children
 */
export default defineEventHandler(async (event) => {
  const user = await requireAuthUser(event)
  const supabase = useSupabaseAdmin()
  const tenantId = await getParentTenantForUser(user.id, user.email)

  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, display_name, avatar_emoji, grade, interests, is_active')
    .eq('tenant_id', tenantId)
    .eq('role', 'student')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error) throw createError({ statusCode: 500, message: error.message })

  setCookie(event, 'family_tenant_id', tenantId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })

  return { children: data ?? [] }
})
