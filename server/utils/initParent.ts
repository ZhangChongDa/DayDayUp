/**
 * 首次登录时自动创建 tenant + parent profile（幂等）
 */
export async function ensureParentProfile(userId: string, email?: string) {
  const supabase = useSupabaseAdmin()

  const { data: existing } = await supabase
    .from('user_profiles')
    .select('id, tenant_id')
    .eq('user_id', userId)
    .eq('role', 'parent')
    .maybeSingle()

  if (existing) return { tenantId: existing.tenant_id, isNew: false }

  const { data: tenant, error: tenantErr } = await supabase
    .from('tenants')
    .insert({ name: `${email?.split('@')[0] ?? userId}'s Family` })
    .select('id')
    .single()

  if (tenantErr) throw createError({ statusCode: 500, message: tenantErr.message })

  const { error: profileErr } = await supabase
    .from('user_profiles')
    .insert({
      user_id: userId,
      tenant_id: tenant.id,
      role: 'parent',
      display_name: email?.split('@')[0] ?? 'Parent',
    })

  if (profileErr) throw createError({ statusCode: 500, message: profileErr.message })

  return { tenantId: tenant.id, isNew: true }
}
