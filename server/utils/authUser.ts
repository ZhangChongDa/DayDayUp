import type { JwtPayload } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { serverSupabaseUser } from '#supabase/server'

/**
 * @nuxtjs/supabase v2 的 serverSupabaseUser 返回 JWT claims，用户 ID 在 `sub` 而非 `id`
 */
export function getAuthUserId(claims: JwtPayload | null | undefined): string | null {
  if (!claims) return null
  return (claims.sub ?? (claims as { id?: string }).id) ?? null
}

export function getAuthUserEmail(claims: JwtPayload | null | undefined): string | null {
  if (!claims) return null
  const meta = (claims as { user_metadata?: { email?: string } }).user_metadata
  return claims.email ?? meta?.email ?? null
}

export async function requireAuthUser(event: H3Event) {
  const claims = await serverSupabaseUser(event)
  const id = getAuthUserId(claims)

  if (!claims || !id) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  return {
    id,
    email: getAuthUserEmail(claims),
    claims,
  }
}
