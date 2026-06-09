/** 与 server/utils/storageMime.ts 保持一致，供客户端 Blob / FormData 使用 */

export function normalizeStorageMimeType(mime: string, fallback = 'application/octet-stream'): string {
  const base = mime.split(';')[0]?.trim().toLowerCase()
  return base || fallback
}

export function storageExtFromMime(mime: string): string {
  const normalized = normalizeStorageMimeType(mime, 'audio/webm')
  if (normalized.includes('mp4')) return 'm4a'
  if (normalized.includes('mpeg')) return 'mp3'
  if (normalized.includes('ogg')) return 'ogg'
  if (normalized.startsWith('image/')) return normalized.split('/')[1] || 'jpg'
  return 'webm'
}
