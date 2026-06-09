-- =============================================
-- 熊孩纸 Phase 1 初始化迁移
-- 应用前请确认 Supabase 项目 URL 与 Service Key 已正确配置
-- =============================================

-- 启用必要扩展
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ─── 租户表（一个家庭 = 一个租户）─────────────────────────────────
create table if not exists public.tenants (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  plan        text not null default 'free',  -- free | pro | school
  settings    jsonb not null default '{}',    -- 保留给 OpenClaw 配置
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.tenants is '家庭租户，每个家长注册后自动创建';

-- ─── 用户档案表（家长 + 孩子共用）────────────────────────────────
create table if not exists public.user_profiles (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade,  -- 家长有 auth user；孩子可为 null
  tenant_id       uuid not null references public.tenants(id) on delete cascade,
  role            text not null check (role in ('parent', 'student')),
  display_name    text not null,
  avatar_emoji    text default '🐻',
  grade           text,                       -- g1~g12
  interests       text[] default '{}',
  pin_code        text,                       -- 孩子专用 6 位 PIN（bcrypt 哈希）
  ai_teacher_name text default '小熊老师',    -- onboarding 起名
  ai_config       jsonb not null default '{}', -- OpenClaw SOUL 等配置（留位）
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  -- 家长账号必须绑定 auth user
  constraint parent_must_have_user check (role != 'parent' or user_id is not null)
);

comment on table public.user_profiles is '用户档案：家长与孩子共用，通过 tenant_id 隔离';
comment on column public.user_profiles.pin_code is '孩子登录 PIN，使用 crypt() + bf 哈希存储';

-- ─── 对话会话表────────────────────────────────────────────────────
create table if not exists public.chat_sessions (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.user_profiles(id) on delete cascade,
  tenant_id   uuid not null references public.tenants(id) on delete cascade,
  title       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── 对话消息表────────────────────────────────────────────────────
create table if not exists public.chat_messages (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid not null references public.chat_sessions(id) on delete cascade,
  tenant_id    uuid not null references public.tenants(id) on delete cascade,
  role         text not null check (role in ('user', 'assistant', 'system')),
  content      text not null,
  attachments  jsonb default '[]',  -- [{type:'image'|'audio', url:'...', name:'...'}]
  tokens       integer,
  created_at   timestamptz not null default now()
);

-- ─── 更新时间自动触发器────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tenants_updated_at
  before update on public.tenants
  for each row execute function public.handle_updated_at();

create trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.handle_updated_at();

create trigger chat_sessions_updated_at
  before update on public.chat_sessions
  for each row execute function public.handle_updated_at();

-- ─── 索引──────────────────────────────────────────────────────────
create index if not exists idx_user_profiles_tenant on public.user_profiles(tenant_id);
create index if not exists idx_user_profiles_user   on public.user_profiles(user_id);
create index if not exists idx_chat_sessions_profile on public.chat_sessions(profile_id);
create index if not exists idx_chat_messages_session on public.chat_messages(session_id);

-- ─── 启用 Row Level Security ──────────────────────────────────────
alter table public.tenants        enable row level security;
alter table public.user_profiles  enable row level security;
alter table public.chat_sessions  enable row level security;
alter table public.chat_messages  enable row level security;

-- ─── RLS 策略：tenants ────────────────────────────────────────────
-- 家长只能看自己的租户
create policy "tenant_select_own"
  on public.tenants for select
  using (
    id in (
      select tenant_id from public.user_profiles
      where user_id = auth.uid()
    )
  );

create policy "tenant_update_own"
  on public.tenants for update
  using (
    id in (
      select tenant_id from public.user_profiles
      where user_id = auth.uid() and role = 'parent'
    )
  );

-- ─── RLS 策略：user_profiles ──────────────────────────────────────
-- 同租户内所有成员可读
create policy "profile_select_same_tenant"
  on public.user_profiles for select
  using (
    tenant_id in (
      select tenant_id from public.user_profiles
      where user_id = auth.uid()
    )
  );

-- 只有家长可以 insert（建孩子档案）
create policy "profile_insert_parent_only"
  on public.user_profiles for insert
  with check (
    -- 家长插入自己档案：user_id = auth.uid()
    -- 家长插入孩子档案：tenant_id 属于自己，且是 parent 角色
    auth.uid() is not null and (
      user_id = auth.uid()
      or (
        tenant_id in (
          select tenant_id from public.user_profiles
          where user_id = auth.uid() and role = 'parent'
        )
      )
    )
  );

-- 家长可以更新同租户内任意档案；用户可以更新自己
create policy "profile_update_parent_or_self"
  on public.user_profiles for update
  using (
    user_id = auth.uid()
    or tenant_id in (
      select tenant_id from public.user_profiles
      where user_id = auth.uid() and role = 'parent'
    )
  );

-- ─── RLS 策略：chat_sessions & chat_messages ──────────────────────
create policy "chat_sessions_same_tenant"
  on public.chat_sessions for all
  using (
    tenant_id in (
      select tenant_id from public.user_profiles
      where user_id = auth.uid()
    )
  );

create policy "chat_messages_same_tenant"
  on public.chat_messages for all
  using (
    tenant_id in (
      select tenant_id from public.user_profiles
      where user_id = auth.uid()
    )
  );

-- ─── Service role 绕过 RLS（用于 server-side API）────────────────
-- service_role 默认跳过 RLS，无需额外配置

-- ─── 辅助函数：哈希 PIN（插入时调用）────────────────────────────────────────
create or replace function public.hash_pin(p_pin text)
returns text as $$
begin
  return crypt(p_pin, gen_salt('bf', 10));
end;
$$ language plpgsql security definer;

comment on function public.hash_pin is '将明文 PIN 哈希为 bcrypt，插入孩子档案前调用';

-- ─── 辅助函数：验证孩子 PIN────────────────────────────────────────
-- stored_hash 必须是 hash_pin() 生成的 bcrypt 哈希，crypt(明文, hash) 会自动用 hash 内嵌的 salt 重新计算后比对
create or replace function public.verify_student_pin(
  p_profile_id uuid,
  p_pin        text
) returns boolean as $$
declare
  stored_hash text;
begin
  select pin_code into stored_hash
  from public.user_profiles
  where id = p_profile_id and role = 'student' and is_active = true;

  if stored_hash is null then
    return false;
  end if;

  return stored_hash = crypt(p_pin, stored_hash);
end;
$$ language plpgsql security definer;

comment on function public.verify_student_pin is '验证孩子 PIN（bcrypt 比对），使用 service_role 调用以绕过 RLS';
