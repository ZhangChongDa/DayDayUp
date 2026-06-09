/**
 * POST /api/auth/verify-otp
 * 验证 Resend OTP → 初始化家长档案 → 返回 Supabase token_hash（客户端直接建 session，无需 magic link 跳转）
 */
export default defineEventHandler(async (event) => {
  const { email, otp } = await readBody<{ email: string; otp: string }>(event)
  const config = useRuntimeConfig()

  if (!email || !otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
    throw createError({ statusCode: 400, message: '请输入 6 位数字验证码' })
  }

  const supabase = useSupabaseAdmin()

  const { data: record, error: findErr } = await supabase
    .from('email_otps')
    .select('id, expires_at')
    .eq('email', email)
    .eq('otp_code', otp)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (findErr || !record) {
    throw createError({ statusCode: 401, message: '验证码错误或已过期，请重新获取' })
  }

  await supabase
    .from('email_otps')
    .update({ used: true })
    .eq('id', record.id)

  const appUrl = config.public.appUrl as string
  let tokenHash: string | undefined
  let userId: string | undefined

  const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: `${appUrl}/auth/callback` },
  })

  if (linkErr) {
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    })

    if (createErr && !createErr.message.includes('already registered')) {
      throw createError({ statusCode: 500, message: `创建用户失败: ${createErr.message}` })
    }

    userId = created?.user?.id

    const { data: retryLink, error: retryErr } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: { redirectTo: `${appUrl}/auth/callback` },
    })

    if (retryErr || !retryLink?.properties?.hashed_token) {
      throw createError({ statusCode: 500, message: '生成登录令牌失败，请重试' })
    }

    tokenHash = retryLink.properties.hashed_token
    userId = userId ?? retryLink.user?.id
  }
  else {
    tokenHash = linkData.properties.hashed_token
    userId = linkData.user?.id
  }

  if (!tokenHash) {
    throw createError({ statusCode: 500, message: '生成登录令牌失败' })
  }

  if (!userId) {
    userId = await resolveUserIdByEmail(supabase, email) ?? undefined
  }

  if (!userId) {
    throw createError({ statusCode: 500, message: '无法定位用户账号，请重试' })
  }

  const { tenantId } = await ensureParentProfile(userId, email)

  setCookie(event, 'family_tenant_id', tenantId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })

  return { success: true, email, tokenHash }
})
