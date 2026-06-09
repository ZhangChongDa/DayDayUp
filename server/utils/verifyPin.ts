/**
 * 验证孩子 PIN（兼容 bcrypt 哈希 + 历史明文）
 */
export async function verifyStudentPin(profileId: string, pin: string): Promise<boolean> {
  const supabase = useSupabaseAdmin()

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('pin_code')
    .eq('id', profileId)
    .eq('role', 'student')
    .eq('is_active', true)
    .single()

  if (error || !profile?.pin_code) return false

  const stored = profile.pin_code as string

  // bcrypt 哈希（$2a$ / $2b$ 开头）
  if (stored.startsWith('$2')) {
    const { data, error: rpcErr } = await supabase.rpc('verify_student_pin', {
      p_profile_id: profileId,
      p_pin: pin,
    })
    if (rpcErr) {
      console.error('[verifyStudentPin] RPC error:', rpcErr.message)
      return false
    }
    return !!data
  }

  // 历史明文 PIN 兼容（创建孩子时未跑 hash_pin 的情况）
  return stored === pin
}
