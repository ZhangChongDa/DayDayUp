<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const supabase = useSupabaseClient()

async function logout() {
  await supabase.auth.signOut()
  await navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 顶部导航 -->
    <header class="sticky top-0 z-50 glass border-b border-border/50 px-4 py-3">
      <div class="max-w-2xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-2 min-w-0">
          <BearLogo :size="32" :animated="false" />
          <div class="min-w-0 leading-tight">
            <p class="font-bold text-sm truncate">{{ t('app.name') }}</p>
            <p class="text-[11px] text-muted-foreground truncate">{{ t('parent.dashboard') }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Button variant="ghost" size="sm" @click="logout">
            {{ t('nav.logout') }}
          </Button>
        </div>
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <Card
        v-if="$route.path === '/parent'"
        class="border-brand-cyan/30 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-950/30 dark:to-cyan-950/30"
      >
        <CardContent class="pt-4 pb-4">
          <p class="text-sm font-medium text-zinc-900 dark:text-zinc-50">{{ t('parent.setupWelcome') }}</p>
          <p class="text-xs text-muted-foreground mt-1">{{ t('parent.setupHint') }}</p>
        </CardContent>
      </Card>
      <NuxtPage />
      <ParentChildrenManager v-if="$route.path === '/parent'" />
    </main>
  </div>
</template>
