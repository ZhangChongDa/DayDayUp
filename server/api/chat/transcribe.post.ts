/**
 * POST /api/chat/transcribe
 * 千问3-ASR-Flash：支持 JSON（storagePath/audioUrl）或 FormData（file）
 */

async function resolveUploadActor(event: Parameters<typeof requireAuthUser>[0]) {
  try {
    const user = await requireAuthUser(event)
    return { id: user.id }
  }
  catch {
    const studentId = getCookie(event, 'active_student_profile_id')
    if (!studentId) {
      throw createError({ statusCode: 401, message: 'Unauthorized' })
    }
    return { id: studentId }
  }
}

export default defineEventHandler(async (event) => {
  await resolveUploadActor(event)

  const contentType = getRequestHeader(event, 'content-type') ?? ''

  let storagePath: string | undefined
  let audioUrl: string | undefined
  let mimeType: string | undefined
  let language = 'zh'
  let fileBuffer: Buffer | undefined

  if (contentType.includes('multipart/form-data')) {
    const form = await readFormData(event)
    const file = form.get('file') as File | null
    language = (form.get('language') as string | null) ?? 'zh'

    if (!file || file.size === 0) {
      throw createError({ statusCode: 400, message: 'file required' })
    }

    fileBuffer = Buffer.from(await file.arrayBuffer())
    mimeType = normalizeStorageMimeType(file.type || 'audio/webm', 'audio/webm')
  }
  else {
    const body = await readBody<{
      audioUrl?: string
      storagePath?: string
      mimeType?: string
      language?: string
    }>(event)

    storagePath = body.storagePath?.trim()
    audioUrl = body.audioUrl?.trim()
    mimeType = body.mimeType
    language = body.language ?? 'zh'

    if (!storagePath && !audioUrl) {
      throw createError({ statusCode: 400, message: 'storagePath or audioUrl required' })
    }
  }

  const result = await transcribeAudioSource(
    {
      storagePath,
      audioUrl,
      buffer: fileBuffer,
      mimeType,
    },
    { language, enableItn: true },
  )

  return {
    text: result.text,
    audioUrl,
    storagePath,
  }
})
