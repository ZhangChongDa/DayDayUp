<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  disabled?: boolean
  uploading?: boolean
  transcribing?: boolean
  hasAttachments?: boolean
  centered?: boolean
}>(), {
  disabled: false,
  uploading: false,
  transcribing: false,
  hasAttachments: false,
  centered: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  send: []
  'ptt-send': [payload: { text: string, audio: { url: string, name: string }, durationSec: number }]
  'image-file': [file: File]
  transcribing: [value: boolean]
}>()

const { t } = useI18n()
const voice = useChatVoice()

watch(() => voice.isTranscribing.value, value => emit('transcribing', value), { immediate: true })

const fileInput = ref<HTMLInputElement>()
const textareaRef = ref<HTMLTextAreaElement>()
const dictationMode = ref(false)
const pttActive = ref(false)
const pttRemainingSec = ref(60)
const pttButtonRef = ref<HTMLElement | null>(null)

let pttCountdownTimer: ReturnType<typeof setInterval> | null = null
let pttEnding = false

const isBusy = computed(() => props.disabled || props.uploading || voice.isTranscribing.value)
const isRecording = computed(() => voice.isRecording.value)
const liveWaveformLevels = computed(() => {
  void voice.levelTick.value
  return voice.audioLevels.value
})
const showVoicePanel = computed(() => dictationMode.value || pttActive.value || isRecording.value)
const canSend = computed(() => (props.modelValue.trim().length > 0 || props.hasAttachments) && !isBusy.value && !showVoicePanel.value)

function resizeTextarea() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 160)}px`
}

watch(() => props.modelValue, () => nextTick(resizeTextarea))

function updateText(value: string) {
  emit('update:modelValue', value)
}

function stopPttCountdown() {
  if (pttCountdownTimer) {
    clearInterval(pttCountdownTimer)
    pttCountdownTimer = null
  }
}

function startPttCountdown() {
  stopPttCountdown()
  pttRemainingSec.value = 60
  pttCountdownTimer = setInterval(() => {
    pttRemainingSec.value = voice.getPttRemainingSec(60)
    if (pttRemainingSec.value <= 0) {
      void finishPttHold(true)
    }
  }, 100)
}

async function handleDictationStart() {
  if (isBusy.value || showVoicePanel.value) return
  dictationMode.value = true
  voice.voiceError.value = null
  await voice.startRecording()
  if (!isRecording.value) dictationMode.value = false
}

function handleDictationCancel() {
  voice.cancelVoice()
  dictationMode.value = false
  pttActive.value = false
  stopPttCountdown()
}

async function handleDictationConfirm() {
  const text = await voice.finishDictation()
  dictationMode.value = false
  if (text) updateText(props.modelValue ? `${props.modelValue} ${text}` : text)
}

async function beginPttHold() {
  if (isBusy.value || dictationMode.value || pttActive.value) return
  pttActive.value = true
  pttEnding = false
  voice.voiceError.value = null
  await voice.startRecording({
    maxDurationMs: voice.MAX_PTT_MS,
    onMaxDuration: () => finishPttHold(true),
  })
  if (!isRecording.value) {
    pttActive.value = false
    return
  }
  startPttCountdown()
}

function handlePttPointerDown(e: PointerEvent) {
  if (e.button !== 0) return
  e.preventDefault()
  const el = e.currentTarget as HTMLElement
  pttButtonRef.value = el
  try { el.setPointerCapture(e.pointerId) }
  catch { /* ignore */ }
  void beginPttHold()
}

function handlePttPointerLeave(e: PointerEvent) {
  if (pttActive.value && isRecording.value && e.buttons === 0) {
    void finishPttHold(false)
  }
}

function handlePttCancel() {
  stopPttCountdown()
  voice.cancelVoice()
  pttActive.value = false
  pttEnding = false
}

async function finishPttHold(fromTimeout = false) {
  if (!pttActive.value || pttEnding) return
  pttEnding = true
  stopPttCountdown()

  const result = await voice.finishPttAndUpload()
  pttActive.value = false
  pttEnding = false

  if (result) {
    emit('ptt-send', {
      text: result.text,
      audio: result.upload,
      durationSec: result.durationSec,
    })
  }
  else if (fromTimeout) {
    voice.voiceError.value = t('chat.pttTimeout')
  }
}

async function handlePttEnd(e: PointerEvent) {
  if (!pttActive.value) return
  if (e.button !== 0 && e.type === 'pointerup') return
  e.preventDefault()
  try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId) }
  catch { /* ignore */ }
  await finishPttHold(false)
}

function handleSend() {
  if (!canSend.value) return
  emit('send')
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

function handleImageChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) emit('image-file', file)
  if (target) target.value = ''
}

onUnmounted(() => stopPttCountdown())

defineExpose({ voiceError: voice.voiceError, fileInput })
</script>

<template>
  <div class="w-full max-w-3xl mx-auto">
    <p v-if="voice.voiceError.value" class="mb-2 text-center text-sm text-destructive">
      {{ voice.voiceError.value }}
    </p>

    <div
      class="relative flex items-end gap-1 rounded-[28px] border border-border/80 bg-background shadow-[0_2px_24px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_24px_-4px_rgba(0,0,0,0.35)] px-2 py-2 sm:px-3 sm:py-2.5 transition-shadow focus-within:shadow-[0_4px_32px_-6px_rgba(0,0,0,0.12)]"
      :class="pttActive && isRecording ? 'border-emerald-500/40 ring-2 ring-emerald-500/20' : ''"
    >
      <button
        type="button"
        class="h-11 w-11 shrink-0 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40"
        :disabled="isBusy || showVoicePanel"
        :title="t('chat.uploadImage')"
        @click="fileInput?.click()"
      >
        <AppIcon icon="lucide:plus" :size="22" />
      </button>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleImageChange"
      >

      <div class="flex-1 min-w-0 py-1.5">
        <div v-if="showVoicePanel" class="flex items-center gap-2.5 min-h-[44px] w-full">
          <!-- 与 AI 语音输出同款灰色胶囊，避免波形被拉满整行 -->
          <div
            class="inline-flex items-center gap-2.5 rounded-[20px] bg-muted px-3 py-2 shrink-0"
            :class="pttActive ? 'min-w-[200px]' : 'min-w-[180px] max-w-[240px]'"
          >
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background/80 text-foreground"
            >
              <AppIcon icon="lucide:mic" :size="16" />
            </span>
            <VoiceWaveform
              :levels="liveWaveformLevels"
              :tick="voice.levelTick.value"
              :bar-count="20"
              variant="neutral"
              density="capsule"
            />
          </div>
          <div
            v-if="pttActive && isRecording"
            class="shrink-0 flex flex-col items-center justify-center min-w-[40px] ml-auto"
          >
            <span class="text-lg font-semibold tabular-nums text-emerald-600 dark:text-emerald-400 leading-none">
              {{ pttRemainingSec }}
            </span>
            <span class="text-[10px] text-muted-foreground">s</span>
          </div>
        </div>
        <textarea
          v-else
          ref="textareaRef"
          :value="modelValue"
          rows="1"
          class="w-full resize-none bg-transparent px-1 text-[15px] sm:text-base placeholder:text-muted-foreground focus:outline-none min-h-[28px] max-h-[160px] scrollbar-hide leading-relaxed"
          :placeholder="t('chat.placeholder')"
          :disabled="isBusy"
          @input="updateText(($event.target as HTMLTextAreaElement).value); resizeTextarea()"
          @keydown="handleKeydown"
        />
        <p
          v-if="pttActive && isRecording"
          class="mt-1 px-1 text-xs text-emerald-600 dark:text-emerald-400"
        >
          {{ t('chat.pttHoldHint') }}
        </p>
        <p
          v-else-if="dictationMode && isRecording"
          class="mt-1 px-1 text-xs text-muted-foreground"
        >
          {{ t('chat.dictationHint') }}
        </p>
      </div>

      <template v-if="dictationMode">
        <button
          type="button"
          class="h-11 w-11 shrink-0 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
          :title="t('common.cancel')"
          @click="handleDictationCancel"
        >
          <AppIcon icon="lucide:x" :size="22" />
        </button>
        <button
          type="button"
          class="h-11 w-11 shrink-0 flex items-center justify-center rounded-full bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-40"
          :disabled="voice.isTranscribing.value"
          :title="t('chat.dictationConfirm')"
          @click="handleDictationConfirm"
        >
          <AppIcon icon="lucide:check" :size="22" />
        </button>
      </template>

      <template v-else>
        <button
          type="button"
          class="h-11 w-11 shrink-0 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40"
          :disabled="isBusy || pttActive"
          :title="t('chat.dictation')"
          @click="handleDictationStart"
        >
          <AppIcon icon="lucide:mic" :size="22" />
        </button>

        <button
          v-if="canSend && !pttActive"
          type="button"
          class="h-11 w-11 shrink-0 flex items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition-opacity disabled:opacity-40"
          :disabled="isBusy"
          :title="t('chat.send')"
          @click="handleSend"
        >
          <AppIcon icon="lucide:arrow-up" :size="22" />
        </button>

        <!-- 微信式按住说话：按下变绿 + 60s 倒计时 -->
        <button
          v-else
          ref="pttButtonRef"
          type="button"
          class="h-11 w-11 shrink-0 flex items-center justify-center rounded-full select-none touch-manipulation transition-all duration-150 disabled:opacity-40"
          :class="pttActive && isRecording
            ? 'bg-emerald-500 text-white scale-110 shadow-[0_0_0_6px_rgba(16,185,129,0.35)]'
            : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90'"
          :disabled="isBusy && !pttActive"
          :aria-label="t('chat.holdToTalk')"
          :aria-pressed="pttActive && isRecording"
          @contextmenu.prevent
          @pointerdown="handlePttPointerDown"
          @pointerup="handlePttEnd"
          @pointercancel.prevent="handlePttCancel"
          @pointerleave="handlePttPointerLeave"
        >
          <AppIcon
            :icon="pttActive && isRecording ? 'lucide:mic' : 'lucide:audio-waveform'"
            :size="20"
          />
        </button>
      </template>
    </div>
  </div>
</template>
