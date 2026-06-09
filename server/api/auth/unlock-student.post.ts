/**
 * POST /api/auth/unlock-student
 * 孩子 PIN 验证：校验通过后写 cookie
 */
export default defineEventHandler(async (event) => {
  const { profileId, pin } = await readBody<{ profileId: string; pin: string }>(event)

  if (!profileId || !pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
    throw createError({ statusCode: 400, message: 'Invalid request' })
  }

  const valid = await verifyStudentPin(profileId, pin)

  if (!valid) {
    throw createError({ statusCode: 401, message: 'Invalid PIN' })
  }

  const supabase = useSupabaseAdmin()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id, display_name, avatar_emoji, grade, ai_teacher_name')
    .eq('id', profileId)
    .single()

  // 非 httpOnly：客户端路由守卫需读取；PIN 验证通过后才写入
  setCookie(event, 'active_student_profile_id', profileId, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return { success: true, profile }
})
