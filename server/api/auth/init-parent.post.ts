/**
 * POST /api/auth/init-parent
 * 首次登录时自动创建 tenant + parent profile（幂等）
 */
export default defineEventHandler(async (event) => {
  const { userId, email } = await readBody<{ userId: string; email: string }>(event)

  if (!userId) throw createError({ statusCode: 400, message: 'userId required' })

  return ensureParentProfile(userId, email)
})
