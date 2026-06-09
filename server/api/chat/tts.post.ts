/**
 * POST /api/chat/tts
 * CosyVoice cosyvoice-v3.5-flash（测试默认人声 longanyang → 自动降级 v3-flash）
 */

async function resolveChatActor(event: Parameters<typeof requireAuthUser>[0]) {
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
  await resolveChatActor(event)

  const body = await readBody<{ text: string; voice?: string; instruction?: string }>(event)
  if (!body.text?.trim()) {
    throw createError({ statusCode: 400, message: 'text required' })
  }

  const { buffer, mimeType } = await synthesizeCosyVoice(body.text, {
    voice: body.voice,
    instruction: body.instruction,
  })

  setResponseHeader(event, 'Content-Type', mimeType)
  setResponseHeader(event, 'Cache-Control', 'no-store')
  return buffer
})
