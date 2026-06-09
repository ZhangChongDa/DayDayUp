-- =============================================
-- 熊孩纸 Migration 0003：email_otps 表 API 访问授权
-- 背景：项目创建时关闭了「Automatically expose new tables」，
--       新表默认 API DISABLED，server 端 supabase-js 无法读写。
-- 安全策略：仅 service_role 可访问，anon/authenticated 禁止直连
-- =============================================

-- 1. 仅授予 service_role（服务端 API 使用，自动绕过 RLS）
GRANT ALL ON TABLE public.email_otps TO service_role;

-- 2. 明确禁止前端角色直接访问 OTP 表（安全）
REVOKE ALL ON TABLE public.email_otps FROM anon, authenticated;

-- 3. 通知 PostgREST 重新加载 schema（让 API 立即识别该表）
NOTIFY pgrst, 'reload schema';
