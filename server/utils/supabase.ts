import { createClient } from '@supabase/supabase-js'

/**
 * 服务端 Supabase 客户端（Service Role，绕过 RLS）
 */
export function useSupabaseAdmin() {
  const config = useRuntimeConfig()

  const url = config.public.supabaseUrl as string
  const key = (
    config.supabaseServiceKey
    || process.env.NUXT_SUPABASE_SECRET_KEY
    || process.env.SUPABASE_SERVICE_KEY
  ) as string

  if (!url || !key) {
    throw createError({
      statusCode: 500,
      message: 'Supabase 服务端配置缺失，请检查 .env 中的 SUPABASE_URL 和 SUPABASE_SERVICE_KEY',
    })
  }

  return createClient(url, key, { auth: { persistSession: false } })
}
