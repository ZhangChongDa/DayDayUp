/** Supabase Storage 只认基础 MIME，需去掉 ;codecs=opus 等参数 */

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'audio/webm': 'webm',
  'audio/mp4': 'm4a',
  'audio/mpeg': 'mp3',
  'audio/ogg': 'ogg',
}

export function normalizeStorageMimeType(mime: string, fallback = 'application/octet-stream'): string {
  const base = mime.split(';')[0]?.trim().toLowerCase()
  return base || fallback
}

export function storageExtFromMime(mime: string, type: 'image' | 'audio' | string): string {
  const normalized = normalizeStorageMimeType(mime)
  return MIME_TO_EXT[normalized] ?? (type === 'audio' ? 'webm' : 'jpg')
}
