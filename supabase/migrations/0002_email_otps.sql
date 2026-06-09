-- =============================================
-- 熊孩纸 Migration 0002：自定义邮件 OTP 存储表
-- 用途：Resend 发送 OTP，服务端验证，无需依赖 Supabase 内置邮件
-- =============================================

create table if not exists public.email_otps (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  otp_code    text not null,                                       -- 6 位数字，明文（短期，验证后立即标记 used）
  expires_at  timestamptz not null default (now() + interval '10 minutes'),
  used        boolean not null default false,
  created_at  timestamptz not null default now()
);

comment on table public.email_otps is '自定义邮件 OTP，10 分钟有效，验证后立即标记 used';

-- 查询索引（email + 未使用）
create index if not exists idx_email_otps_lookup
  on public.email_otps(email, otp_code)
  where not used;

-- 过期记录索引（定期清理用）
create index if not exists idx_email_otps_expires
  on public.email_otps(expires_at);

-- 启用 RLS（仅 service_role 可操作，前端无法直接访问）
alter table public.email_otps enable row level security;

-- 无 RLS 策略 = 普通用户完全无法访问，只有 service_role 可以绕过 RLS
-- service_role 在 server/utils/supabase.ts 的 useSupabaseAdmin() 中使用

-- 定期清理过期 OTP 的函数（可通过 pg_cron 或手动调用）
create or replace function public.cleanup_expired_otps()
returns void as $$
begin
  delete from public.email_otps
  where expires_at < now() or used = true;
end;
$$ language plpgsql security definer;
