/**
 * POST /api/auth/update-ai-name
 * 更新孩子的 AI 老师名字（onboarding 步骤）
 */
export default defineEventHandler(async (event) => {
  const { aiTeacherName } = await readBody<{ aiTeacherName: string }>(event)
  const profileId = getCookie(event, 'active_student_profile_id')

  if (!profileId) throw createError({ statusCode: 401, message: 'No active profile' })
  if (!aiTeacherName?.trim()) throw createError({ statusCode: 400, message: 'aiTeacherName required' })

  const supabase = useSupabaseAdmin()

  const { data: existing } = await supabase
    .from('user_profiles')
    .select('ai_config')
    .eq('id', profileId)
    .single()

  const { error } = await supabase
    .from('user_profiles')
    .update({
      ai_teacher_name: aiTeacherName.trim(),
      ai_config: { ...(existing?.ai_config as object ?? {}), onboarding_done: true },
    })
    .eq('id', profileId)

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true }
})
