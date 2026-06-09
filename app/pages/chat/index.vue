<script setup lang="ts">
import { createSessionId, saveChatBootstrap } from '~/lib/chatSession'

definePageMeta({ layout: 'chat' })

const { t } = useI18n()
const router = useRouter()

const inputText = ref('')
const uploadingFile = ref(false)
const uploadError = ref<string | null>(null)
const pendingAttachments = ref<Array<{ type: 'image' | 'audio', url: string, name?: string }>>([])

const quickPrompts = computed(() => [
  { icon: 'lucide:image', label: t('chat.chipImage') },
  { icon: 'lucide:pencil', label: t('chat.chipWrite') },
  { icon: 'lucide:globe', label: t('chat.chipLookup') },
])

function goToSession(payload: { text: string, attachments?: typeof pendingAttachments.value }) {
  const sessionId = createSessionId()
  saveChatBootstrap(sessionId, payload)
  router.push(`/chat/${sessionId}`)
}

function handleSend() {
  const text = inputText.value.trim()
  if (!text && pendingAttachments.value.length === 0) return
  goToSession({ text, attachments: [...pendingAttachments.value] })
}

function handlePttSend(payload: { text: string, audio: { url: string, name: string }, durationSec: number }) {
  goToSession({
    text: payload.text,
    attachments: [{
      type: 'audio',
      url: payload.audio.url,
      name: payload.audio.name,
      durationSec: payload.durationSec,
    }],
  })
}

async function handleImageFile(file: File) {
  uploadingFile.value = true
  uploadError.value = null
  try {
    const form = new FormData()
    form.append('file', file)
    form.append('type', 'image')
    const result = await $fetch<{ url: string, name: string }>('/api/chat/upload', { method: 'POST', body: form })
    pendingAttachments.value.push({ type: 'image', url: result.url, name: result.name })
  }
  catch (e: any) {
    uploadError.value = e?.data?.message ?? e?.message ?? t('chat.uploadFailed')
  }
  finally {
    uploadingFile.value = false
  }
}

function handleQuickPrompt(label: string) {
  inputText.value = label
}
</script>

<template>
  <div class="flex h-full min-h-0">
    <ChatSidebar />

    <div class="flex flex-1 flex-col min-w-0">
      <!-- 顶栏 -->
      <header class="flex items-center justify-between px-4 sm:px-6 py-3 shrink-0">
        <div class="flex items-center gap-2 min-w-0">
          <BearLogo :size="28" :animated="false" />
          <span class="font-semibold text-sm sm:text-base truncate">{{ t('app.name') }}</span>
          <AppIcon icon="lucide:chevron-down" :size="16" class="text-muted-foreground hidden sm:block" />
        </div>
        <div class="flex items-center gap-1">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </header>

      <!-- 居中欢迎区（附件1） -->
      <main class="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-6 overflow-auto">
        <div class="w-full max-w-3xl flex flex-col items-center gap-8 sm:gap-10">
          <h1 class="text-2xl sm:text-3xl font-medium text-center text-foreground tracking-tight">
            {{ t('chat.landingTitle') }}
          </h1>

          <ChatComposer
            v-model="inputText"
            centered
            :uploading="uploadingFile"
            :has-attachments="pendingAttachments.length > 0"
            @send="handleSend"
            @ptt-send="handlePttSend"
            @image-file="handleImageFile"
          />

          <div
            v-if="uploadError"
            class="text-sm text-destructive text-center"
          >
            {{ uploadError }}
          </div>

          <div
            v-if="pendingAttachments.length > 0"
            class="flex flex-wrap gap-2 justify-center w-full"
          >
            <div
              v-for="(att, i) in pendingAttachments"
              :key="i"
              class="relative"
            >
              <img
                :src="att.url"
                class="w-14 h-14 object-cover rounded-xl border border-border"
              >
              <button
                type="button"
                class="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-foreground text-background flex items-center justify-center"
                @click="pendingAttachments.splice(i, 1)"
              >
                <AppIcon icon="lucide:x" :size="12" />
              </button>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              v-for="chip in quickPrompts"
              :key="chip.label"
              type="button"
              class="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground hover:bg-muted/60 transition-colors"
              @click="handleQuickPrompt(chip.label)"
            >
              <AppIcon :icon="chip.icon" :size="16" class="text-muted-foreground" />
              {{ chip.label }}
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
