<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()

function startNewChat() {
  router.push('/chat')
}
</script>

<template>
  <aside
    class="hidden sm:flex w-14 lg:w-16 shrink-0 flex-col items-center justify-between py-4 border-r border-border/60 bg-background/80"
  >
    <div class="flex flex-col items-center gap-2">
      <button
        type="button"
        class="h-11 w-11 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        :title="t('chat.newChat')"
        @click="startNewChat"
      >
        <AppIcon icon="lucide:square-pen" :size="20" />
      </button>
      <button
        type="button"
        class="h-11 w-11 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        :title="t('chat.history')"
      >
        <AppIcon icon="lucide:search" :size="20" />
      </button>
      <button
        type="button"
        class="h-11 w-11 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        :title="t('chat.history')"
      >
        <AppIcon icon="lucide:clock" :size="20" />
      </button>
    </div>

    <NuxtLink
      to="/parent"
      class="hover:opacity-90 transition-opacity"
      :title="t('nav.parent')"
    >
      <BearLogo :size="36" :animated="false" />
    </NuxtLink>
  </aside>
</template>
