/** 孩子 PIN 会话 cookie（须客户端可读，供路由守卫判断） */
export const STUDENT_SESSION_COOKIE = 'active_student_profile_id'

export function useStudentSessionCookie() {
  return useCookie<string | null>(STUDENT_SESSION_COOKIE, {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
    // 不能 httpOnly：客户端 middleware 需要读取；PIN 验证后才写入，风险可控
    secure: process.env.NODE_ENV === 'production',
  })
}

export function setStudentSession(profileId: string) {
  const cookie = useStudentSessionCookie()
  cookie.value = profileId
}

export function clearStudentSession() {
  const cookie = useStudentSessionCookie()
  cookie.value = null
}
