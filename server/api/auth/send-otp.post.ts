/**
 * POST /api/auth/send-otp
 * 生成 6 位数字 OTP → 存 DB → 通过 Resend 发送漂亮邮件
 * Body: { email: string }
 */
export default defineEventHandler(async (event) => {
  const { email } = await readBody<{ email: string }>(event)

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, message: '请输入有效的邮箱地址' })
  }

  const supabase = useSupabaseAdmin()
  const resend = useResend()
  const otp = generateOtp()

  // 1. 清除该邮箱旧的未使用 OTP（防止重复发送）
  await supabase
    .from('email_otps')
    .update({ used: true })
    .eq('email', email)
    .eq('used', false)

  // 2. 存储新 OTP（10 分钟有效）
  const { error: insertErr } = await supabase
    .from('email_otps')
    .insert({ email, otp_code: otp })

  if (insertErr) {
    const hint = insertErr.message.includes('email_otps')
      ? '请先在 Supabase SQL Editor 执行 supabase/migrations/0002_email_otps.sql'
      : ''
    throw createError({
      statusCode: 500,
      message: `存储 OTP 失败: ${insertErr.message}${hint ? `（${hint}）` : ''}`,
    })
  }

  // 3. 通过 Resend 发送邮件
  const config = useRuntimeConfig()
  const appUrl = (config.public.appUrl as string || 'http://localhost:3000').replace(/\/$/, '')
  const { error: mailErr } = await resend.emails.send({
    from: MAIL_FROM,
    to: email,
    subject: `${otp} 是你的 DayDayUp 登录验证码`,
    html: buildOtpEmailHtml(otp, email, `${appUrl}/brand/daydayup-logo.png`),
  })

  if (mailErr) {
    throw createError({ statusCode: 500, message: `邮件发送失败: ${mailErr.message}` })
  }

  return { success: true }
})
