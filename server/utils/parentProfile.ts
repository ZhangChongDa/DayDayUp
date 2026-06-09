/**
 * 解析家长 tenant_id；若档案缺失则自动补建（幂等）
 */
export async function getParentTenantForUser(userId: string, email?: string | null) {
  const supabase = useSupabaseAdmin()

  const { data: existing } = await supabase
    .from('user_profiles')
    .select('tenant_id')
    .eq('user_id', userId)
    .eq('role', 'parent')
    .maybeSingle()

  if (existing?.tenant_id) {
    return existing.tenant_id
  }

  // 登录成功但 verify-otp 未写入档案时自动补建
  const { tenantId } = await ensureParentProfile(userId, email ?? undefined)
  return tenantId
}
