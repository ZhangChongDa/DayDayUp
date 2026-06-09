import type { SupabaseClient } from '@supabase/supabase-js'

/** 按邮箱从 auth.users 查找 user id（分页遍历） */
export async function resolveUserIdByEmail(
  supabase: SupabaseClient,
  email: string,
): Promise<string | null> {
  const normalized = email.toLowerCase()
  let page = 1

  while (page <= 20) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (error || !data?.users?.length) break

    const found = data.users.find(u => u.email?.toLowerCase() === normalized)
    if (found?.id) return found.id

    if (data.users.length < 200) break
    page++
  }

  return null
}
