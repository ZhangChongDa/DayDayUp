<script setup lang="ts">
const { t } = useI18n()

const showAddForm = ref(false)
const loading = ref(false)
const formError = ref('')

const form = reactive({
  displayName: '',
  grade: 'g1',
  interests: '',
  avatarEmoji: '🐻',
  pin: '',
  confirmPin: '',
})

const avatarOptions = ['🐻', '🦊', '🐼', '🐯', '🦁', '🐮', '🐷', '🐸', '🐧', '🐬']

const gradeOptions = [
  'g1','g2','g3','g4','g5','g6','g7','g8','g9','g10','g11','g12',
]

const { data, refresh } = await useFetch('/api/parent/children')
const children = computed(() => data.value?.children ?? [])

// 新家长首次进入：自动展开建档表单
watchEffect(() => {
  if (children.value.length === 0) {
    showAddForm.value = true
  }
})

async function createChild() {
  formError.value = ''
  if (!form.displayName.trim()) {
    formError.value = '请填写孩子名字'
    return
  }
  if (form.pin.length !== 6 || !/^\d{6}$/.test(form.pin)) {
    formError.value = 'PIN 码必须是 6 位数字'
    return
  }
  if (form.pin !== form.confirmPin) {
    formError.value = t('parent.pinMismatch')
    return
  }

  loading.value = true
  try {
    await $fetch('/api/parent/create-child', {
      method: 'POST',
      body: {
        displayName: form.displayName.trim(),
        grade: form.grade,
        interests: form.interests.split(/[,，\s]+/).filter(Boolean),
        pin: form.pin,
        avatarEmoji: form.avatarEmoji,
      },
    })
    Object.assign(form, { displayName: '', grade: 'g1', interests: '', pin: '', confirmPin: '', avatarEmoji: '🐻' })
    await refresh()
    showAddForm.value = false
    // 首个孩子创建完成 → 引导去孩子端 PIN 登录
    await navigateTo('/select-role')
  }
  catch (e: any) {
    formError.value = e.data?.message ?? '创建失败'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold">{{ t('parent.children') }}</h2>
      <Button size="sm" @click="showAddForm = !showAddForm">
        {{ showAddForm ? t('common.cancel') : t('parent.addChild') }}
      </Button>
    </div>

    <!-- 添加孩子表单 -->
    <Card v-if="showAddForm" class="border border-border">
      <CardContent class="pt-4">
      <form class="space-y-4" @submit.prevent="createChild">
        <!-- 头像选择 -->
        <div>
          <Label class="mb-2 block">头像</Label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="emoji in avatarOptions"
              :key="emoji"
              type="button"
              class="text-2xl w-11 h-11 rounded-xl border-2 flex items-center justify-center transition-all"
              :class="form.avatarEmoji === emoji
                ? 'border-zinc-900 dark:border-zinc-50 bg-zinc-100 dark:bg-zinc-800'
                : 'border-border hover:border-zinc-400'"
              @click="form.avatarEmoji = emoji"
            >
              {{ emoji }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <Label for="child-name">{{ t('parent.childName') }}</Label>
            <Input id="child-name" v-model="form.displayName" :placeholder="t('parent.childName')" />
          </div>

          <div class="space-y-1.5">
            <Label for="child-grade">{{ t('parent.childGrade') }}</Label>
            <select
              id="child-grade"
              v-model="form.grade"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option v-for="g in gradeOptions" :key="g" :value="g">
                {{ t(`parent.grades.${g}`) }}
              </option>
            </select>
          </div>
        </div>

        <div class="space-y-1.5">
          <Label for="interests">{{ t('parent.childInterests') }}</Label>
          <Input id="interests" v-model="form.interests" placeholder="数学、科学、绘画..." />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <Label for="pin">{{ t('parent.setPin') }}</Label>
            <Input
              id="pin"
              v-model="form.pin"
              type="password"
              inputmode="numeric"
              maxlength="6"
              placeholder="6 位数字"
            />
          </div>
          <div class="space-y-1.5">
            <Label for="confirm-pin">{{ t('parent.confirmPin') }}</Label>
            <Input
              id="confirm-pin"
              v-model="form.confirmPin"
              type="password"
              inputmode="numeric"
              maxlength="6"
              placeholder="再输一遍"
            />
          </div>
        </div>

        <p v-if="formError" class="text-sm text-destructive">{{ formError }}</p>

        <FlowButton type="submit" class="w-full" :loading="loading">
          {{ t('parent.addChild') }}
        </FlowButton>
      </form>
      </CardContent>
    </Card>

    <!-- 孩子列表 -->
    <div v-if="children.length === 0 && !showAddForm" class="text-center py-12 text-muted-foreground">
      <BearLogo :size="64" class="mx-auto mb-4 opacity-40" />
      <p class="text-sm">还没有孩子账号，点击上方按钮添加</p>
    </div>

    <div class="grid gap-3">
      <Card v-for="child in children" :key="child.id" class="hover:shadow-md transition-shadow">
        <CardContent class="pt-4 flex items-center gap-3">
          <span class="text-3xl">{{ child.avatar_emoji }}</span>
          <div class="flex-1 min-w-0">
            <p class="font-semibold truncate">{{ child.display_name }}</p>
            <p class="text-sm text-muted-foreground">{{ t(`parent.grades.${child.grade}`) }}</p>
          </div>
          <Badge variant="secondary">正常</Badge>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
