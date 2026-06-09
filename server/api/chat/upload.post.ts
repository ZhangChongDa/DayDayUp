/**
 * POST /api/chat/upload
 * 多模态附件 → Supabase Storage（bearkid-media 公开 bucket）
 */

const MIME_FALLBACK: Record<string, string> = {
  image: 'image/jpeg',
  audio: 'audio/webm',
}

async function resolveUploadActor(event: Parameters<typeof requireAuthUser>[0]) {
  try {
    const user = await requireAuthUser(event)
    return { id: user.id, source: 'parent' as const }
  }
  catch {
    const studentId = getCookie(event, 'active_student_profile_id')
    if (!studentId) {
      throw createError({ statusCode: 401, message: 'Unauthorized' })
    }
    return { id: studentId, source: 'student' as const }
  }
}

function resolveExtension(file: File, mimeType: string, type: string): string {
  const fromName = file.name?.split('.').pop()?.toLowerCase()
  if (fromName && fromName.length <= 5) return fromName
  return storageExtFromMime(mimeType, type)
}

export default defineEventHandler(async (event) => {
  const actor = await resolveUploadActor(event)

  const formData = await readFormData(event)
  const file = formData.get('file') as File | null
  const type = (formData.get('type') as string | null) ?? 'image'

  if (!file || file.size === 0) {
    throw createError({ statusCode: 400, message: 'file required' })
  }

  const maxSizes: Record<string, number> = {
    image: 10 * 1024 * 1024,
    audio: 25 * 1024 * 1024,
  }

  const maxSize = maxSizes[type] ?? 10 * 1024 * 1024
  if (file.size > maxSize) {
    throw createError({ statusCode: 413, message: 'File too large' })
  }

  const rawMime = file.type || MIME_FALLBACK[type] || 'application/octet-stream'
  const mimeType = normalizeStorageMimeType(rawMime, MIME_FALLBACK[type] || 'application/octet-stream')
  const ext = resolveExtension(file, mimeType, type)
  const path = `chat/${actor.id}/${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase.storage
    .from(BEARKID_MEDIA_BUCKET)
    .upload(path, buffer, {
      contentType: mimeType,
      upsert: false,
    })

  if (error) {
    const lower = error.message?.toLowerCase() ?? ''
    const hint = lower.includes('bucket')
      ? `请先在 Supabase 创建公开 bucket「${BEARKID_MEDIA_BUCKET}」，或执行 supabase/migrations/0005_bearkid_media_bucket.sql`
      : lower.includes('mime type')
        ? `${error.message}（已规范化 MIME 仍被拒绝时，请执行 supabase/migrations/0006_bearkid_media_relax_mime.sql）`
        : error.message

    throw createError({ statusCode: 500, message: hint })
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BEARKID_MEDIA_BUCKET)
    .getPublicUrl(data.path)

  return {
    url: publicUrl,
    path: data.path,
    type,
    name: file.name || `${type}-${Date.now()}.${ext}`,
    size: file.size,
    mimeType,
  }
})
