-- 放宽 bearkid-media MIME 限制（浏览器 MediaRecorder 可能带 codecs 参数）
-- 若已遇到 "mime type audio/webm;codecs=opus is not supported"，执行本脚本

UPDATE storage.buckets
SET allowed_mime_types = NULL
WHERE id = 'bearkid-media';
