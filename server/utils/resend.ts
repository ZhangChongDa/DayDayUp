import { Resend } from 'resend'

let _resend: Resend | null = null

export function useResend(): Resend {
  if (!_resend) {
    const config = useRuntimeConfig()
    _resend = new Resend(config.resendApiKey as string)
  }
  return _resend
}

/** 发件人地址（使用自定义域名） */
export const MAIL_FROM = 'DayDayUp <noreply@mail.eazzyai.com>'

/** 生成 6 位纯数字 OTP */
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/** 漂亮的 OTP 邮件 HTML 模板 */
export function buildOtpEmailHtml(otp: string, email: string, logoUrl?: string): string {
  const digits = otp.split('')
  const brandLogo = logoUrl
    ? `<img src="${logoUrl}" alt="DayDayUp" width="64" height="64" style="display:block;margin:0 auto 12px;border-radius:50%;" />`
    : `<div style="font-size:48px;line-height:1;margin-bottom:12px;">DDU</div>`
  return `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>DayDayUp 登录验证码</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- 头部品牌区 -->
          <tr>
            <td align="center" style="background:linear-gradient(135deg,#1276cf 0%,#00abec 50%,#0de3ec 100%);padding:36px 40px 28px;">
              ${brandLogo}
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">DayDayUp</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">你的专属 AI 学习伙伴</p>
            </td>
          </tr>

          <!-- 正文 -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h2 style="margin:0 0 8px;color:#09090b;font-size:20px;font-weight:600;">登录验证码</h2>
              <p style="margin:0 0 28px;color:#71717a;font-size:14px;line-height:1.6;">
                你正在登录 <strong style="color:#09090b;">${email}</strong> 账号，<br/>
                请在 <strong style="color:#09090b;">10 分钟</strong>内使用以下验证码完成登录：
              </p>

              <!-- OTP 数字格 -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                <tr>
                  ${digits.map(d => `
                  <td style="padding:0 4px;">
                    <div style="
                      width:52px;height:64px;
                      background:#f4f4f5;
                      border:2px solid #e4e4e7;
                      border-radius:12px;
                      font-size:32px;font-weight:700;
                      color:#09090b;
                      text-align:center;line-height:64px;
                      font-family:'Courier New',monospace;
                    ">${d}</div>
                  </td>`).join('')}
                </tr>
              </table>

              <p style="margin:0 0 8px;color:#a1a1aa;font-size:12px;text-align:center;">
                验证码 10 分钟内有效 · 请勿转发给他人
              </p>
            </td>
          </tr>

          <!-- 分隔线 -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:#f4f4f5;"></div>
            </td>
          </tr>

          <!-- 底部提示 -->
          <tr>
            <td style="padding:24px 40px 32px;">
              <p style="margin:0;color:#a1a1aa;font-size:12px;line-height:1.6;">
                如果你没有尝试登录 DayDayUp，请忽略此邮件。<br/>
                你的账号安全不会受到任何影响。
              </p>
            </td>
          </tr>

        </table>

        <!-- 页脚 -->
        <p style="margin:24px 0 0;color:#a1a1aa;font-size:11px;">
          © 2026 DayDayUp · AI 教育平台
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`
}
