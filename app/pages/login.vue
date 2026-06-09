<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const user = useSupabaseUser()
const supabase = useSupabaseClient()

const verifying = ref(false)

// 已有 session 时自动跳转（OTP 验证过程中跳过，避免竞态）
watchEffect(async () => {
  if (!user.value || verifying.value) return
  try {
    const { next } = await $fetch<{ next: string }>('/api/auth/next-step')
    await navigateTo(next)
  }
  catch {
    await navigateTo('/parent')
  }
})

const tab = ref<'parent' | 'student'>('parent')
const email = ref('')
const otp = ref('')
const step = ref<'input' | 'otp'>('input')
const loading = ref(false)
const countdown = ref(0)
const errorMsg = ref('')

let countdownTimer: ReturnType<typeof setInterval> | null = null

function startCountdown() {
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0 && countdownTimer) clearInterval(countdownTimer)
  }, 1000)
}

/** 第一步：通过 Resend 发送 OTP */
async function sendOtp() {
  errorMsg.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/send-otp', {
      method: 'POST',
      body: { email: email.value },
    })
    step.value = 'otp'
    startCountdown()
  }
  catch (e: any) {
    errorMsg.value = e.data?.message ?? t('auth.loginError')
  }
  finally {
    loading.value = false
  }
}

/** 第二步：验证 OTP → 客户端直接建立 Supabase session（无需 magic link 跳转） */
async function verifyOtp() {
  if (otp.value.length !== 6) return
  errorMsg.value = ''
  loading.value = true
  verifying.value = true
  try {
    const result = await $fetch<{ success: boolean; email: string; tokenHash: string }>('/api/auth/verify-otp', {
      method: 'POST',
      body: { email: email.value, otp: otp.value },
    })

    const { error: sessionErr } = await supabase.auth.verifyOtp({
      token_hash: result.tokenHash,
      type: 'email',
    })

    if (sessionErr) {
      throw new Error(sessionErr.message)
    }

    const { next } = await $fetch<{ next: string }>('/api/auth/next-step')
    await navigateTo(next)
  }
  catch (e: any) {
    errorMsg.value = e.data?.message ?? e.message ?? t('auth.loginError')
    otp.value = ''
  }
  finally {
    loading.value = false
    verifying.value = false
  }
}

// OTP 输入满 6 位自动提交
watch(otp, (val) => {
  if (val.length === 6) verifyOtp()
})

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})
</script>

<template>
  <div>
    <!-- Logo + 标题 -->
    <div class="flex flex-col items-center mb-8 gap-3">
      <BearLogo :size="72" />
      <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {{ t('app.name') }}
      </h1>
      <p class="text-sm text-muted-foreground">{{ t('app.tagline') }}</p>
    </div>

    <Card class="glass border-0 shadow-xl shadow-zinc-900/5 dark:shadow-zinc-900/30">
      <CardContent class="pt-6">
        <!-- 角色切换 -->
        <div class="flex rounded-lg bg-muted p-1 mb-6">
          <button
            class="flex-1 rounded-md py-2 text-sm font-medium transition-all duration-200"
            :class="tab === 'parent'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'"
            @click="tab = 'parent'; step = 'input'; errorMsg = ''"
          >
            {{ t('auth.parent') }}
          </button>
          <button
            class="flex-1 rounded-md py-2 text-sm font-medium transition-all duration-200"
            :class="tab === 'student'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'"
            @click="navigateTo('/select-role')"
          >
            {{ t('auth.student') }}
          </button>
        </div>

        <!-- 家长邮件 OTP 登录 -->
        <template v-if="tab === 'parent'">
          <!-- 步骤 1：输入邮箱 -->
          <template v-if="step === 'input'">
            <form class="space-y-4" @submit.prevent="sendOtp">
              <div class="space-y-2">
                <Label for="email">{{ t('auth.emailLabel') }}</Label>
                <Input
                  id="email"
                  v-model="email"
                  type="email"
                  :placeholder="t('auth.emailPlaceholder')"
                  :disabled="loading"
                  class="h-11"
                  autocomplete="email"
                  required
                />
              </div>

              <p v-if="errorMsg" class="text-sm text-destructive text-center">{{ errorMsg }}</p>

              <FlowButton type="submit" class="w-full h-11" :loading="loading">
                {{ t('auth.sendOtp') }}
              </FlowButton>
            </form>
          </template>

          <!-- 步骤 2：输入 6 位验证码 -->
          <template v-else>
            <div class="space-y-5">
              <div class="text-center">
                <p class="text-sm text-muted-foreground">
                  验证码已发送至 <span class="font-medium text-foreground">{{ email }}</span>
                </p>
              </div>

              <!-- OTP 6 格输入 -->
              <div class="flex gap-2 justify-center">
                <div
                  v-for="i in 6"
                  :key="i"
                  class="w-11 h-14 rounded-xl border-2 flex items-center justify-center text-xl font-mono font-bold transition-all duration-150"
                  :class="otp.length >= i
                    ? 'border-zinc-900 dark:border-zinc-50 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
                    : 'border-border bg-muted text-transparent'"
                >
                  {{ otp[i - 1] ?? '' }}
                </div>
              </div>

              <!-- 数字键盘（移动端友好） -->
              <div class="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
                <button
                  v-for="n in [1,2,3,4,5,6,7,8,9,'',0,'⌫']"
                  :key="n"
                  class="h-12 rounded-xl text-lg font-medium transition-all duration-100 active:scale-95"
                  :class="n === '' ? 'pointer-events-none' : 'bg-muted hover:bg-muted/80 text-foreground'"
                  :disabled="loading"
                  @click="n === '⌫'
                    ? otp = otp.slice(0, -1)
                    : (n !== '' && otp.length < 6 && (otp += String(n)))"
                >
                  {{ n }}
                </button>
              </div>

              <!-- 倒计时重发 -->
              <p class="text-xs text-muted-foreground text-center">
                <template v-if="countdown > 0">
                  {{ t('auth.resendIn', { s: countdown }) }}
                </template>
                <button
                  v-else
                  class="text-primary underline-offset-4 hover:underline"
                  @click="step = 'input'; otp = ''"
                >
                  {{ t('auth.sendOtp') }}
                </button>
              </p>

              <p v-if="errorMsg" class="text-sm text-destructive text-center">{{ errorMsg }}</p>

              <div v-if="loading" class="flex justify-center py-2">
                <BearThinking />
              </div>
            </div>
          </template>
        </template>
      </CardContent>
    </Card>

    <!-- 语言 / 主题 -->
    <div class="flex justify-center gap-4 mt-6">
      <LanguageSwitcher />
      <ThemeSwitcher />
    </div>
  </div>
</template>
