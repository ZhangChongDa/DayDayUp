<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const { t } = useI18n()

const teacherName = ref('')
const loading = ref(false)
const step = ref<'name' | 'greeting'>('name')
const greetingMsg = ref('')

const suggestions = ['小熊老师', '学霸熊', '聪聪', '星星老师', '哆啦熊']

async function confirmName() {
  const name = teacherName.value.trim() || t('onboarding.defaultName')
  loading.value = true

  try {
    // 保存 AI 老师名字到 profile
    await $fetch('/api/auth/update-ai-name', {
      method: 'POST',
      body: { aiTeacherName: name },
    })

    greetingMsg.value = t('onboarding.greeting', { name })
    step.value = 'greeting'
  }
  catch {
    greetingMsg.value = t('onboarding.greeting', { name })
    step.value = 'greeting'
  }
  finally {
    loading.value = false
  }
}

async function goToChat() {
  await navigateTo('/chat')
}
</script>

<template>
  <div>
    <!-- Logo -->
    <div class="flex flex-col items-center mb-8 gap-2">
      <BearLogo :size="80" />
      <h1 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{{ t('app.name') }}</h1>
    </div>

    <Card class="glass border-0 shadow-xl shadow-zinc-900/5 dark:shadow-zinc-900/30">
      <CardContent class="pt-6">
        <!-- 起名步骤 -->
        <template v-if="step === 'name'">
          <div class="text-center mb-6">
            <h2 class="text-xl font-bold mb-2">{{ t('onboarding.title') }}</h2>
            <p class="text-sm text-muted-foreground">{{ t('onboarding.subtitle') }}</p>
          </div>

          <div class="space-y-4">
            <Input
              v-model="teacherName"
              class="h-12 text-center text-lg"
              :placeholder="t('onboarding.namePlaceholder')"
              maxlength="10"
              @keydown.enter="confirmName"
            />

            <!-- 推荐名字 -->
            <div class="flex flex-wrap gap-2 justify-center">
              <button
                v-for="name in suggestions"
                :key="name"
                class="px-3 py-1 rounded-full border border-border text-sm hover:bg-muted transition-colors"
                @click="teacherName = name"
              >
                {{ name }}
              </button>
            </div>

            <FlowButton
              class="w-full h-12 text-base"
              :loading="loading"
              @click="confirmName"
            >
              {{ t('onboarding.confirm') }}
            </FlowButton>

            <button
              class="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
              @click="teacherName = ''; confirmName()"
            >
              {{ t('onboarding.skip') }}
            </button>
          </div>
        </template>

        <!-- 打招呼步骤 -->
        <template v-else>
          <div class="flex flex-col items-center gap-4 py-4">
            <BearTalking :size="56" />
            <div class="bg-muted/50 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed max-w-[260px]">
              {{ greetingMsg }}
            </div>
            <Button
              size="xl"
              class="w-full mt-4 shadow-lg"
              @click="goToChat"
            >
              开始学习！🎉
            </Button>
          </div>
        </template>
      </CardContent>
    </Card>
  </div>
</template>
