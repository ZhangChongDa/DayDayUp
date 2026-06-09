<script setup lang="ts">
import { consumeChatBootstrap } from '~/lib/chatSession'

definePageMeta({ layout: 'chat' })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const { messages, isThinking, isTalking, isStreaming, streamingMessageId, error, sendMessage, clearMessages: clearChatMessages } = useChatStream()
const {
  isSpeaking,
  speakingMessageId,
  ttsError,
  duration: ttsDuration,
  currentTime: ttsCurrentTime,
  playbackLevels: ttsPlaybackLevels,
  speak,
  stop: stopTts,
} = useChatTts()
const inputText = ref('')
const messagesContainer = ref<HTMLElement>()
const uploadingFile = ref(false)
const isTranscribing = ref(false)
const uploadError = ref<string | null>(null)
const pendingAttachments = ref<Array<{ type: 'image' | 'audio', url: string, name?: string }>>([])

const hasConversation = computed(() => messages.value.length > 0)

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

watch(messages, () => scrollToBottom(), { deep: true })
watch(isThinking, () => scrollToBottom())

function hadVoiceInput(attachments: typeof pendingAttachments.value) {
  return attachments.some(a => a.type === 'audio')
}

async function maybeSpeakAssistant(
  result: { assistantId: string, assistantText: string } | null,
  attachments: typeof pendingAttachments.value,
) {
  if (!result?.assistantText?.trim() || !hadVoiceInput(attachments)) return
  await speak(result.assistantText, result.assistantId)
}

async function handleSend() {
  const text = inputText.value.trim()
  const atts = [...pendingAttachments.value]
  if (!text && atts.length === 0) return

  stopTts()
  inputText.value = ''
  pendingAttachments.value = []
  const result = await sendMessage(text, atts)
  await maybeSpeakAssistant(result, atts)
}

async function handlePttSend(payload: { text: string, audio: { url: string, name: string }, durationSec: number }) {
  stopTts()
  const atts = [{
    type: 'audio' as const,
    url: payload.audio.url,
    name: payload.audio.name,
    durationSec: payload.durationSec,
  }]
  const result = await sendMessage(payload.text, atts)
  await maybeSpeakAssistant(result, atts)
}

function handleReplayTts(content: string, messageId: string) {
  stopTts()
  speak(content, messageId)
}

function clearMessages() {
  stopTts()
  clearChatMessages()
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

onMounted(async () => {
  const sessionId = route.params.sessionId as string
  const bootstrap = consumeChatBootstrap(sessionId)
  if (bootstrap?.text || bootstrap?.attachments?.length) {
    const bootstrapAtts = bootstrap.attachments ?? []
    await sendMessage(bootstrap.text ?? '', bootstrapAtts)
    const lastAssistant = messages.value.filter(m => m.role === 'assistant').at(-1)
    if (lastAssistant?.content) {
      await maybeSpeakAssistant(
        { assistantId: lastAssistant.id, assistantText: lastAssistant.content },
        bootstrapAtts,
      )
    }
  }
})
</script>

<template>
  <div class="flex h-full min-h-0 overflow-hidden">
    <ChatSidebar />

    <div class="flex flex-1 flex-col min-w-0 min-h-0 overflow-hidden">
      <!-- 顶栏 -->
      <header class="flex items-center gap-2 px-3 sm:px-4 py-3 border-b border-border/50 shrink-0">
        <button
          type="button"
          class="h-11 w-11 flex items-center justify-center rounded-xl hover:bg-muted transition-colors sm:hidden"
          @click="router.push('/chat')"
        >
          <AppIcon icon="lucide:chevron-left" :size="22" />
        </button>
        <div class="flex items-center gap-2 flex-1 min-w-0">
          <BearLogo :size="28" :animated="isTalking || isThinking || isSpeaking" />
          <div class="min-w-0">
            <p class="text-sm font-semibold truncate">{{ t('chat.teacherName') }}</p>
            <p v-if="isTranscribing" class="text-xs text-muted-foreground">{{ t('chat.transcribing') }}</p>
            <p v-else-if="isThinking" class="text-xs text-muted-foreground">{{ t('chat.thinking') }}</p>
            <p v-else-if="isTalking" class="text-xs text-brand-cyan">{{ t('chat.talking') }}</p>
            <p v-else-if="isSpeaking" class="text-xs text-brand-cyan">{{ t('chat.speaking') }}</p>
            <p v-else class="text-xs text-muted-foreground">{{ t('chat.ready') }}</p>
          </div>
        </div>
        <button
          type="button"
          class="h-11 w-11 flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-muted-foreground"
          :title="t('chat.clearHistory')"
          @click="clearMessages"
        >
          <AppIcon icon="lucide:trash-2" :size="18" />
        </button>
      </header>

      <!-- 无消息：居中欢迎（附件1风格） -->
      <main
        v-if="!hasConversation"
        class="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-6 overflow-auto"
      >
        <div class="w-full max-w-3xl flex flex-col items-center gap-8">
          <h1 class="text-2xl sm:text-3xl font-medium text-center tracking-tight">
            {{ t('chat.landingTitle') }}
          </h1>
          <ChatComposer
            v-model="inputText"
            centered
            :uploading="uploadingFile"
            :has-attachments="pendingAttachments.length > 0"
            :disabled="isThinking || isTalking"
            @send="handleSend"
            @ptt-send="handlePttSend"
            @image-file="handleImageFile"
            @transcribing="isTranscribing = $event"
          />

          <div v-if="uploadError" class="text-sm text-destructive text-center">{{ uploadError }}</div>

          <div v-if="pendingAttachments.length" class="flex flex-wrap gap-2 justify-center">
            <div v-for="(att, i) in pendingAttachments" :key="i" class="relative">
              <img :src="att.url" class="w-14 h-14 object-cover rounded-xl border border-border">
              <button
                type="button"
                class="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-foreground text-background flex items-center justify-center"
                @click="pendingAttachments.splice(i, 1)"
              >
                <AppIcon icon="lucide:x" :size="12" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <!-- 有消息：会话布局 -->
      <div v-else class="flex flex-1 flex-col min-h-0 overflow-hidden">
        <div
          ref="messagesContainer"
          class="flex-1 min-h-0 overflow-y-auto overscroll-contain pb-28 sm:pb-4"
        >
          <ChatMessageList
            :messages="messages"
            :is-streaming="isStreaming"
            :streaming-message-id="streamingMessageId"
            :is-thinking="isThinking"
            :is-talking="isTalking"
            :is-transcribing="isTranscribing"
            :is-speaking="isSpeaking"
            :speaking-message-id="speakingMessageId"
            :tts-duration="ttsDuration"
            :tts-current-time="ttsCurrentTime"
            :tts-playback-levels="ttsPlaybackLevels"
            :error="error"
            :upload-error="uploadError"
            :tts-error="ttsError"
            @replay-tts="handleReplayTts"
            @pause-tts="stopTts"
            @clear-error="error = null"
            @clear-upload-error="uploadError = null"
            @clear-tts-error="ttsError = null"
          />
        </div>

        <div
          v-if="pendingAttachments.length > 0 || uploadingFile"
          class="px-4 py-2 flex gap-2 items-center border-t border-border/50 max-w-3xl mx-auto w-full"
        >
          <Skeleton v-if="uploadingFile" class="w-12 h-12 rounded-lg" />
          <div
            v-for="(att, i) in pendingAttachments"
            :key="i"
            class="relative"
          >
            <img
              v-if="att.type === 'image'"
              :src="att.url"
              class="w-12 h-12 object-cover rounded-lg border border-border"
            >
            <button
              class="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-foreground text-background flex items-center justify-center"
              @click="pendingAttachments.splice(i, 1)"
            >
              <AppIcon icon="lucide:x" :size="10" />
            </button>
          </div>
        </div>

        <footer
          class="fixed bottom-0 inset-x-0 z-30 sm:static shrink-0 border-t border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/85 px-3 sm:px-4 py-3 pb-safe"
        >
          <ChatComposer
            v-model="inputText"
            :uploading="uploadingFile"
            :transcribing="isTranscribing"
            :has-attachments="pendingAttachments.length > 0"
            :disabled="isThinking || isTalking"
            @send="handleSend"
            @ptt-send="handlePttSend"
            @image-file="handleImageFile"
            @transcribing="isTranscribing = $event"
          />
          <p class="mt-2 text-center text-[11px] text-muted-foreground max-w-3xl mx-auto">
            {{ t('chat.disclaimer') }}
          </p>
        </footer>
      </div>
    </div>
  </div>
</template>
