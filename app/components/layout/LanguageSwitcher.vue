<script setup lang="ts">
const { locale, setLocale } = useI18n()

function toggleLocale() {
  setLocale(locale.value === 'zh' ? 'en' : 'zh')
}
</script>

<template>
  <button
    class="h-8 px-2.5 text-xs font-medium rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
    :title="locale === 'zh' ? 'Switch to English' : '切换中文'"
    @click="toggleLocale"
  >
    {{ locale === 'zh' ? 'EN' : '中' }}
  </button>
</template>
