-- BearKid 媒体存储：聊天图片 / 语音附件
-- 在 Supabase SQL Editor 执行，或通过 supabase db push 应用

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bearkid-media',
  'bearkid-media',
  true,
  26214400, -- 25 MB
  NULL  -- 不限制 MIME；浏览器录音可能带 codecs 参数，由服务端规范化后上传
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 公开读：OpenRouter 多模态需要可访问的图片 URL
DROP POLICY IF EXISTS "Public read bearkid-media" ON storage.objects;
CREATE POLICY "Public read bearkid-media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'bearkid-media');

-- 服务端 service_role 上传绕过 RLS；以下为将来客户端直传预留
DROP POLICY IF EXISTS "Authenticated upload bearkid-media" ON storage.objects;
CREATE POLICY "Authenticated upload bearkid-media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'bearkid-media');
