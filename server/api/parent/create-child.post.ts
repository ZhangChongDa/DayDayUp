/**
 * POST /api/parent/create-child
 */
export default defineEventHandler(async (event) => {
  const user = await requireAuthUser(event)

  const { displayName, grade, interests, pin, avatarEmoji } = await readBody<{
    displayName: string
    grade: string
    interests: string[]
    pin: string
    avatarEmoji: string
  }>(event)

  if (!displayName?.trim()) {
    throw createError({ statusCode: 400, message: 'displayName required' })
  }
  if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
    throw createError({ statusCode: 400, message: '6-digit numeric PIN required' })
  }

  const supabase = useSupabaseAdmin()
  const tenantId = await getParentTenantForUser(user.id, user.email)

  const { data: hashedPin, error: hashError } = await supabase
    .rpc('hash_pin', { p_pin: pin })

  if (hashError || !hashedPin) {
    throw createError({ statusCode: 500, message: `Failed to hash PIN: ${hashError?.message}` })
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      tenant_id: tenantId,
      role: 'student',
      display_name: displayName.trim(),
      avatar_emoji: avatarEmoji ?? '🐻',
      grade,
      interests: interests ?? [],
      pin_code: hashedPin,
    })
    .select('id, display_name, avatar_emoji, grade')
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })

  setCookie(event, 'family_tenant_id', tenantId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })

  return { success: true, child: data }
})
