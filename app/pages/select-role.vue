<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const user = useSupabaseUser()

const children = ref<Array<{
  id: string
  display_name: string
  avatar_emoji: string
  grade: string
}>>([])
const needsParentSetup = ref(false)
const selectedChildId = ref<string | null>(null)
const pin = ref('')
const step = ref<'select' | 'pin'>('select')
const loading = ref(false)
const error = ref('')

async function fetchChildren() {
  const endpoint = user.value ? '/api/parent/children' : '/api/auth/family-children'
  const result = await $fetch<{
    children: typeof children.value
    needsParentSetup?: boolean
  }>(endpoint)
  children.value = result.children ?? []
  needsParentSetup.value = result.needsParentSetup ?? false
  return result
}

const { pending } = await useAsyncData('children-list', fetchChildren, {
  watch: [user],
})

// 已登录家长但还没有孩子 → 引导去家长中心建档（含 PIN）
watchEffect(() => {
  if (!pending.value && user.value && children.value.length === 0 && !needsParentSetup.value) {
    navigateTo('/parent')
  }
})

function selectChild(id: string) {
  selectedChildId.value = id
  pin.value = ''
  error.value = ''
  step.value = 'pin'
}

function goBack() {
  step.value = 'select'
  selectedChildId.value = null
  pin.value = ''
  error.value = ''
}

async function submitPin() {
  if (pin.value.length !== 6) return
  error.value = ''
  loading.value = true

  try {
    await $fetch('/api/auth/unlock-student', {
      method: 'POST',
      body: { profileId: selectedChildId.value, pin: pin.value },
    })
    // 同步写入客户端 cookie，确保路由守卫立即识别孩子会话
    if (selectedChildId.value) {
      setStudentSession(selectedChildId.value)
    }
    const { next } = await $fetch<{ next: string }>('/api/auth/next-step')
    await navigateTo(next)
  }
  catch (e: any) {
    error.value = e.data?.message === 'Invalid PIN'
      ? t('auth.pinError')
      : t('auth.loginError')
    pin.value = ''
  }
  finally {
    loading.value = false
  }
}

watch(pin, (val) => {
  if (val.length === 6) submitPin()
})

async function goParentDashboard() {
  if (user.value) {
    await navigateTo('/parent')
  }
  else {
    await navigateTo('/login')
  }
}

const selectedChild = computed(() =>
  children.value.find(c => c.id === selectedChildId.value),
)
</script>

<template>
  <div>
    <div class="flex flex-col items-center mb-8 gap-3">
      <BearLogo :size="64" />
      <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{{ t('app.name') }}</h1>
    </div>

    <Card class="glass border-0 shadow-xl shadow-zinc-900/5 dark:shadow-zinc-900/30">
      <CardContent class="pt-6">
        <template v-if="step === 'select'">
          <h2 class="text-lg font-semibold mb-4 text-center">{{ t('auth.selectChild') }}</h2>

          <div v-if="pending" class="flex justify-center py-8">
            <BearThinking />
          </div>

          <template v-else>
            <div
              v-if="needsParentSetup"
              class="text-center py-6 space-y-4"
            >
              <p class="text-sm text-muted-foreground">{{ t('auth.needsParentSetup') }}</p>
              <Button class="w-full" @click="navigateTo('/login')">
                {{ t('auth.parentLogin') }}
              </Button>
            </div>

            <div
              v-else-if="children.length === 0"
              class="text-center py-6 text-muted-foreground text-sm"
            >
              {{ t('auth.noChildren') }}
            </div>

            <div v-else class="grid grid-cols-2 gap-3 mb-4">
              <button
                v-for="child in children"
                :key="child.id"
                class="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-all duration-150 active:scale-95 min-h-[88px]"
                @click="selectChild(child.id)"
              >
                <span class="text-4xl leading-none">{{ child.avatar_emoji }}</span>
                <span class="text-sm font-medium truncate w-full text-center">{{ child.display_name }}</span>
                <Badge variant="secondary" class="text-xs">{{ t(`parent.grades.${child.grade}`) }}</Badge>
              </button>
            </div>

            <Separator class="my-4" />

            <Button
              variant="ghost"
              class="w-full text-muted-foreground"
              @click="goParentDashboard"
            >
              {{ t('auth.parent') }} →
            </Button>
          </template>
        </template>

        <template v-else>
          <button
            class="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors"
            @click="goBack"
          >
            ← {{ t('common.back') }}
          </button>

          <div class="flex flex-col items-center gap-4">
            <span class="text-5xl">{{ selectedChild?.avatar_emoji }}</span>
            <p class="font-semibold text-lg">{{ selectedChild?.display_name }}</p>
            <p class="text-sm text-muted-foreground">{{ t('auth.pinLabel') }}</p>

            <div class="flex gap-3">
              <div
                v-for="i in 6"
                :key="i"
                class="w-4 h-4 rounded-full border-2 border-zinc-300 dark:border-zinc-600 transition-all duration-150"
                :class="pin.length >= i ? 'bg-zinc-900 dark:bg-zinc-50 border-zinc-900 dark:border-zinc-50' : ''"
              />
            </div>

            <div class="grid grid-cols-3 gap-3 w-full max-w-[240px]">
              <button
                v-for="n in [1,2,3,4,5,6,7,8,9,'',0,'⌫']"
                :key="n"
                class="h-14 rounded-xl text-xl font-medium transition-all duration-100 active:scale-95"
                :class="n === '' ? 'pointer-events-none' : 'bg-muted hover:bg-muted/80 text-foreground'"
                :disabled="loading"
                @click="n === '⌫' ? pin = pin.slice(0,-1) : (n !== '' && pin.length < 6 && (pin += String(n)))"
              >
                {{ n }}
              </button>
            </div>

            <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

            <div v-if="loading" class="flex justify-center">
              <BearThinking />
            </div>
          </div>
        </template>
      </CardContent>
    </Card>
  </div>
</template>
