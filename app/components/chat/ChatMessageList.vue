<script setup lang="ts">
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import type { Message } from '~/composables/useChatStream'

const props = defineProps<{
  messages: Message[]
  isStreaming: boolean
  streamingMessageId: string | null
  isThinking: boolean
  isTalking: boolean
  isTranscribing: boolean
  isSpeaking: boolean
  speakingMessageId: string | null
  ttsDuration: number
  ttsCurrentTime: number
  ttsPlaybackLevels: number[]
  error: string | null
  uploadError: string | null
  ttsError: string | null
}>()

const emit = defineEmits<{
  replayTts: [content: string, messageId: string]
  pauseTts: []
  clearError: []
  clearUploadError: []
  clearTtsError: []
}>()

const { t } = useI18n()

const lastMessage = computed(() => props.messages.at(-1))

function isPendingAssistant(msg: Message) {
  if (msg.role !== 'assistant' || msg.content) return false
  if (msg.id !== lastMessage.value?.id) return false
  return props.isThinking || props.isTalking || props.isStreaming
}

function pendingAssistantLabel(msg: Message) {
  if (props.isThinking && msg.id === lastMessage.value?.id) return t('chat.thinking')
  if (props.isTalking || props.isStreaming) return t('chat.talking')
  return t('chat.thinking')
}

function renderMarkdown(content: string): string {
  const html = marked.parse(content, { async: false }) as string
  return DOMPurify.sanitize(html)
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  }
  catch { /* ignore */ }
}
</script>

<template>
  <div class="px-4 sm:px-6 py-6 space-y-5 scrollbar-hide">
    <div
      v-for="msg in messages"
      :key="msg.id"
      class="max-w-3xl mx-auto w-full flex gap-2.5 sm:gap-3"
      :class="msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'"
    >
      <!-- 头像 -->
      <div class="shrink-0 mt-0.5">
        <BearLogo
          v-if="msg.role === 'assistant'"
          :size="32"
          :animated="isPendingAssistant(msg) || (isSpeaking && speakingMessageId === msg.id)"
        />
        <div
          v-else
          class="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground"
        >
          <AppIcon icon="lucide:user" :size="18" />
        </div>
      </div>

      <!-- 消息体 -->
      <div
        class="min-w-0 flex flex-col gap-1.5"
        :class="msg.role === 'user' ? 'items-end' : 'items-start'"
      >
        <p
          class="text-[11px] text-muted-foreground px-1"
          :class="msg.role === 'user' ? 'text-right' : 'text-left'"
        >
          {{ msg.role === 'user' ? t('chat.you') : t('app.name') }}
        </p>

        <!-- 用户消息 -->
        <template v-if="msg.role === 'user'">
          <div
            v-for="(att, i) in (msg.attachments ?? []).filter(a => a.type === 'audio')"
            :key="`audio-${i}`"
          >
            <VoiceMessageCapsule
              :audio-url="att.url"
              align="right"
              :duration-sec="att.durationSec"
            />
          </div>

          <div
            v-if="(msg.attachments ?? []).some(a => a.type === 'image')"
            class="flex flex-wrap gap-2 justify-end"
          >
            <img
              v-for="(att, i) in msg.attachments!.filter(a => a.type === 'image')"
              :key="`img-${i}`"
              :src="att.url"
              :alt="att.name"
              class="w-28 h-28 object-cover rounded-xl"
            >
          </div>

          <div
            v-if="msg.content"
            class="max-w-[85%] sm:max-w-[75%] rounded-3xl bg-muted px-4 py-2.5 text-[15px] leading-relaxed text-foreground"
          >
            <span class="whitespace-pre-wrap">{{ msg.content }}</span>
          </div>
        </template>

        <!-- AI 消息 -->
        <template v-else>
          <!-- 思考 / 回答中：仅在 DayDayUp 头像下方展示动态点，不重复第二个头像 -->
          <ThinkingDots
            v-if="isPendingAssistant(msg)"
            :label="pendingAssistantLabel(msg)"
          />

          <span
            v-else-if="msg.content && isStreaming && streamingMessageId === msg.id"
            class="text-[15px] leading-relaxed whitespace-pre-wrap max-w-[92%] sm:max-w-[85%]"
          >{{ msg.content }}<span class="inline-block w-0.5 h-4 ml-0.5 bg-brand-cyan animate-pulse align-middle" /></span>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div
            v-else-if="msg.content"
            class="prose prose-sm dark:prose-invert max-w-none prose-p:my-1.5 prose-pre:rounded-lg text-[15px] max-w-[92%] sm:max-w-[85%]"
            v-html="renderMarkdown(msg.content)"
          />

          <div
            v-if="msg.content && !(isStreaming && streamingMessageId === msg.id)"
            class="flex flex-wrap items-center gap-1.5"
          >
            <AssistantVoiceCapsule
              :message-id="msg.id"
              :text="msg.content"
              :is-active="isSpeaking && speakingMessageId === msg.id"
              :duration="ttsDuration"
              :current-time="ttsCurrentTime"
              :levels="ttsPlaybackLevels"
              @play="emit('replayTts', msg.content, msg.id)"
              @pause="emit('pauseTts')"
            />

            <button
              type="button"
              class="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              :title="t('chat.copy')"
              @click="copyText(msg.content)"
            >
              <AppIcon icon="lucide:copy" :size="16" />
            </button>
            <button type="button" class="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors">
              <AppIcon icon="lucide:thumbs-up" :size="16" />
            </button>
            <button type="button" class="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors">
              <AppIcon icon="lucide:thumbs-down" :size="16" />
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- 识别语音中（输入阶段，尚无消息气泡） -->
    <div
      v-if="isTranscribing"
      class="max-w-3xl mx-auto w-full flex gap-2.5 sm:gap-3"
    >
      <BearLogo :size="32" :animated="true" />
      <div class="min-w-0 flex flex-col gap-1.5">
        <p class="text-[11px] text-muted-foreground px-1">{{ t('app.name') }}</p>
        <ThinkingDots :label="t('chat.transcribing')" />
      </div>
    </div>

    <div v-if="error" class="max-w-3xl mx-auto text-center">
      <p class="text-sm text-destructive">{{ t('chat.error') }}</p>
      <Button variant="link" size="sm" @click="emit('clearError')">{{ t('chat.retry') }}</Button>
    </div>
    <div v-if="uploadError" class="max-w-3xl mx-auto text-center">
      <p class="text-sm text-destructive">{{ uploadError }}</p>
      <Button variant="link" size="sm" @click="emit('clearUploadError')">{{ t('chat.retry') }}</Button>
    </div>
    <div v-if="ttsError" class="max-w-3xl mx-auto text-center">
      <p class="text-sm text-destructive">{{ ttsError }}</p>
      <Button variant="link" size="sm" @click="emit('clearTtsError')">{{ t('chat.retry') }}</Button>
    </div>
  </div>
</template>
