# Eazzy Omini Call Center — Nuxt 4 开发技术规范

> **文档用途**：供后续 AI 与开发者在实现功能时**必须遵守**的 Nuxt 4 架构约定。  
> **适用范围**：本仓库 `Eazzy-Omini-CC`（Nuxt 4 + Tailwind CSS v4 + shadcn-vue）。  
> **官方参考**：[Views](https://nuxt.com/docs/4.x/getting-started/views) · [Assets](https://nuxt.com/docs/4.x/getting-started/assets) · [Styling](https://nuxt.com/docs/4.x/getting-started/styling) · [Routing](https://nuxt.com/docs/4.x/getting-started/routing) · [Transitions](https://nuxt.com/docs/4.x/getting-started/transitions) · [Data Fetching](https://nuxt.com/docs/4.x/getting-started/data-fetching) · [State Management](https://nuxt.com/docs/4.x/getting-started/state-management) · [Server](https://nuxt.com/docs/4.x/getting-started/server)

**与 UI/产品规则的关系**：业务交互、视觉风格见同目录 `AICodingRule.md`；本文档仅约束 **Nuxt 4 工程结构与代码模式**。

---

## 0. AI 执行清单（每次改代码前自检）

- [ ] 新页面放在 `app/pages/`，不在 `app/app.vue` 里堆路由逻辑
- [ ] `app/app.vue` 使用 `<NuxtLayout><NuxtPage /></NuxtLayout>`（多布局时）
- [ ] 可复用 UI 放 `app/components/`，shadcn 组件放 `app/components/ui/`
- [ ] 首屏/SEO 数据用 `useFetch` / `useAsyncData`，禁止在 `setup` 里单独 `$fetch` 拉首屏数据
- [ ] 事件触发的提交/删除用 `$fetch`，不混用 `useFetch`
- [ ] 全局状态用 `useState` 或 `app/composables/`，禁止在模块顶层 `export const x = ref()`
- [ ] API 写在 `server/api/`，用 `defineEventHandler`
- [ ] 静态 URL 资源放 `public/`，需构建处理的放 `app/assets/`
- [ ] 样式优先 Tailwind 工具类 + shadcn 主题变量，全局入口仅 `app/assets/css/tailwind.css`
- [ ] 修改 `nuxt.config.ts` 时保留现有 `tailwindcss` Vite 插件与 `shadcn-nuxt` 模块

---

## 1. 项目目录约定（Nuxt 4 `app/` 目录）

```
Eazzy-Omini-CC/
├── app/
│   ├── app.vue                 # 根组件（入口壳）
│   ├── assets/css/tailwind.css # 全局样式唯一入口（Tailwind v4 + shadcn 主题）
│   ├── components/             # 业务组件（自动导入）
│   │   └── ui/                 # shadcn-vue 组件（CLI 生成）
│   ├── composables/            # 组合式函数（自动导入）
│   ├── layouts/                # 布局（default.vue 等）
│   ├── middleware/             # 路由中间件（*.global.ts 为全局）
│   ├── pages/                  # 文件系统路由
│   ├── plugins/                # 客户端/服务端插件
│   └── lib/utils.ts            # cn() 等工具（shadcn）
├── server/
│   ├── api/                    # API 路由 /api/*
│   ├── middleware/             # 服务端中间件（非路由中间件）
│   └── plugins/                # Nitro 插件
├── public/                     # 静态资源，URL 为 /xxx
├── components.json             # shadcn-vue CLI 配置
└── nuxt.config.ts
```

**禁止**：

- 在仓库根目录创建 `pages/`、`components/`（Nuxt 4 默认使用 `app/` 下目录）
- 绕过 `app/components/ui/` 手写一套与 shadcn 重复的按钮/输入框（应 `npx shadcn-vue@latest add <component>`）

---

## 2. Views（视图层）

文档：[Views](https://nuxt.com/docs/4.x/getting-started/views)

### 2.1 `app.vue` — 应用入口

- Nuxt 以 `app/app.vue` 为入口，**无需**手写 `main.ts`。
- 多页面应用**必须**渲染 `<NuxtPage />`；需要布局时包一层 `<NuxtLayout>`。

**推荐根组件结构：**

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

- 仅单一布局、无 `app/layouts/` 时，可简化布局逻辑，但一旦有 `layouts/`，根组件应使用 `<NuxtLayout>`。

### 2.2 `components/` — 组件

- 路径：`app/components/`（含子目录），**自动导入**，模板中直接使用，无需 `import`。
- 命名：PascalCase 文件名 → `<AppHeader />`（目录+文件组合规则见 Nuxt 文档）。
- **业务组件**与 **shadcn UI** 分离：
  - 业务：`app/components/call-center/AgentPanel.vue`
  - UI 库：`app/components/ui/*`（仅通过 CLI 添加）

### 2.3 `pages/` — 页面与路由

- 每个 `app/pages/**/*.vue` 对应一条路由。
- 启用 pages 后，不要在 `app.vue` 写死整页内容而不使用 `<NuxtPage />`。

### 2.4 `layouts/` — 布局

- 默认布局：`app/layouts/default.vue`，使用 `<slot />` 承载页面内容。
- 页面指定布局：`definePageMeta({ layout: 'dashboard' })` → `app/layouts/dashboard.vue`。
- **仅一个布局**时，可用 `app.vue` 代替 `layouts/default.vue`；多布局场景必须用 `layouts/`。

### 2.5 扩展 HTML 模板

- 常规 SEO：使用 `useHead` / `app.head`（`nuxt.config`）。
- 深度修改 HTML：Nitro 插件 `server/plugins/*.ts` 中 `render:html` 钩子（慎用，优先 `useHead`）。

---

## 3. Assets（资源）

文档：[Assets](https://nuxt.com/docs/4.x/getting-started/assets)

| 目录 | 用途 | 引用方式 |
|------|------|----------|
| `public/` | 不经过构建、固定 URL 的静态文件 | `/img/logo.png` |
| `app/assets/` | 由 Vite 处理（压缩、hash、打包） | `~/assets/...` 或 `@/assets/...` |

**规则：**

- 字体、固定 favicon、robots 等 → `public/fonts/`、`public/favicon.ico`
- 需与组件一起打包的图片/样式 → `app/assets/`
- **不要**期望 `app/assets/` 下的文件能通过 `/assets/xxx` 直接访问；需要固定 URL 就用 `public/`。

```vue
<!-- public -->
<img src="/img/logo.svg" alt="Logo" />

<!-- assets（构建处理） -->
<img src="~/assets/img/hero.png" alt="Hero" />
```

---

## 4. Styling（样式）

文档：[Styling](https://nuxt.com/docs/4.x/getting-started/styling)

### 4.1 本项目栈（必须遵守）

- **Tailwind CSS v4** + **`@tailwindcss/vite`**（已在 `nuxt.config.ts` 配置）
- **shadcn-vue** + **`shadcn-nuxt`** 模块
- 全局 CSS **仅**通过 `nuxt.config.ts` 的 `css: ['~/assets/css/tailwind.css']` 引入

```ts
// nuxt.config.ts — 保持以下模式，勿改回 @nuxtjs/tailwindcss 旧模块
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  css: ['~/assets/css/tailwind.css'],
  vite: { plugins: [tailwindcss()] },
  modules: ['shadcn-nuxt'],
  shadcn: { prefix: '', componentDir: '@/components/ui' },
})
```

### 4.2 样式编写优先级

1. **Tailwind 工具类**（模板 `class="..."`）
2. **shadcn 语义色**：`bg-background`、`text-foreground`、`border-border` 等（定义在 `tailwind.css`）
3. 组件内 `<style scoped>` — 仅当 Tailwind 无法表达时
4. 新增全局样式 → 合并进 `app/assets/css/tailwind.css`，避免多处 `nuxt.config` css 入口

### 4.3 组件内样式

- 默认 `<style scoped>`，避免污染全局。
- 使用 CSS 变量与 `v-bind()` 时遵循 [Vue SFC CSS](https://vuejs.org/api/sfc-css-features)。
- 需要动态主题时，在 `html` 或 `body` 上使用 `.dark`（与 shadcn 一致）。

### 4.4 外部样式与字体

- 外链样式：优先 `useHead({ link: [...] })` 或 `app.head.link`
- Google Fonts：已在 `tailwind.css` 通过 `@import url(...)` 引入时，勿重复加载

### 4.5 禁止

- 新增第二套全局 CSS 框架（Bootstrap、Element Plus 全量样式等）除非产品明确要求
- 在 `public/` 放未压缩的大型 CSS 阻塞首屏（见 web.dev defer-non-critical-css）

---

## 5. Routing（路由）

文档：[Routing](https://nuxt.com/docs/4.x/getting-started/routing)

### 5.1 文件系统路由

```
app/pages/index.vue           → /
app/pages/about.vue           → /about
app/pages/posts/[id].vue      → /posts/:id
app/pages/dashboard/index.vue → /dashboard
```

### 5.2 导航

- 站内跳转：**必须**使用 `<NuxtLink to="...">`，不用裸 `<a href>`（避免整页刷新）。
- 需要程序式导航：`navigateTo('/path')` 或 `useRouter().push()`。

### 5.3 路由参数

```vue
<script setup lang="ts">
const route = useRoute()
// /posts/1 → route.params.id === '1'
</script>
```

### 5.4 路由中间件（Vue 应用内）

路径：`app/middleware/`（**不是** `server/middleware`）

| 类型 | 文件命名 | 行为 |
|------|----------|------|
| 命名中间件 | `auth.ts` | 在页面 `definePageMeta({ middleware: 'auth' })` |
| 全局中间件 | `auth.global.ts` | 每次路由变更执行 |

```ts
// app/middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (!isAuthenticated()) {
    return navigateTo('/login')
  }
})
```

**注意**：路由中间件**不**作用于 `/api/*`；API 鉴权在 `server/api` 或 `server/middleware` 处理。

### 5.5 路由校验

```vue
<script setup lang="ts">
definePageMeta({
  validate(route) {
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  },
})
</script>
```

校验失败 → 404。复杂逻辑可用命名中间件。

---

## 6. Transitions（过渡）

文档：[Transitions](https://nuxt.com/docs/4.x/getting-started/transitions)

### 6.1 全局页面过渡

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
})
```

在 `app.vue` 中定义与 `name` 对应的 CSS 类：`.page-enter-active`、`.page-enter-from` 等。

### 6.2 单页覆盖

```vue
<script setup lang="ts">
definePageMeta({
  pageTransition: { name: 'fade', mode: 'out-in' },
  layoutTransition: false,
})
</script>
```

### 6.3 性能与可访问性

- 呼叫中心控制台等**高频切换**页面：优先短过渡（≤200ms）或 `pageTransition: false`
- 尊重 `prefers-reduced-motion`；实验性 View Transitions 需 `experimental.viewTransition: true`，启用前评估与数据请求的冲突（文档 Known Issues）

### 6.4 AI 实现建议

- 列表↔详情：可用滑动过渡；表单、弹窗层：用组件内 `<Transition>`，不必强行页面级过渡

---

## 7. Data Fetching（数据获取）

文档：[Data Fetching](https://nuxt.com/docs/4.x/getting-started/data-fetching)

### 7.1 三者分工（必须区分）

| API | 场景 |
|-----|------|
| `useFetch` / `useAsyncData` | 组件 `setup` 中**首屏/SSR**需要的数据，避免双份请求与 hydration 不一致 |
| `$fetch` | **仅客户端**交互：表单提交、按钮点击、删除、轮询 |
| `useRequestFetch()` | 在服务端 setup 中需要转发 cookie/headers 时 |

### 7.2 标准模式

```vue
<script setup lang="ts">
// ✅ 首屏数据
const { data, pending, error, refresh } = await useFetch('/api/agents')

// ✅ 表单提交
async function onSubmit() {
  await $fetch('/api/calls', { method: 'POST', body: form })
  await refresh()
}
</script>
```

```vue
<script setup lang="ts">
// ❌ 禁止：setup 顶层用 $fetch 拉首屏数据（会 SSR+CSR 各请求一次）
const data = await $fetch('/api/agents')
</script>
```

### 7.3 `useAsyncData` 与 key

- **始终**为 `useAsyncData` 提供明确、稳定的 **字符串 key**（尤其封装在 composable 时）。
- 动态路由：`useAsyncData(\`agent:${id}\`, () => $fetch(\`/api/agents/${id}\`), { watch: [id] })`

### 7.4 常用选项

| 选项 | 用途 |
|------|------|
| `lazy: true` / `useLazyFetch` | 不阻塞导航，自行处理 `status === 'pending'` |
| `server: false` | 仅客户端拉取（非 SEO 数据） |
| `pick` / `transform` | 减小 payload，勿在 HTML 中泄露大对象 |
| `watch: [ref]` | 依赖变化时自动 refetch |
| `immediate: false` | 手动 `execute()` / `refresh()` 再拉取 |

### 7.4 禁止

- 在 `useAsyncData` 回调中执行 Pinia action 等**副作用**（用 `callOnce` 初始化 store）
- 同一 key 使用不一致的 `handler` / `transform` / `deep`（会触发开发警告）

---

## 8. State Management（状态管理）

文档：[State Management](https://nuxt.com/docs/4.x/getting-started/state-management)

### 8.1 首选：`useState`

- SSR 友好，会在 payload 中序列化到客户端。
- **key 全局唯一**；数据必须可 `JSON.stringify`（无 class/function/symbol）。

```ts
// app/composables/useAgentStatus.ts
export const useAgentStatus = () =>
  useState<'ready' | 'busy' | 'offline'>('agent-status', () => 'offline')
```

### 8.2 严禁（内存泄漏 / 跨请求污染）

```ts
// ❌ 永远不要：模块顶层 ref
export const globalCount = ref(0)

// ✅ 使用工厂 + useState
export const useGlobalCount = () => useState('global-count', () => 0)
```

### 8.3 异步初始化

```vue
<script setup lang="ts">
const config = useState('cc-config')

await callOnce(async () => {
  config.value = await $fetch('/api/config')
})
</script>
```

### 8.4 Pinia

- 复杂呼叫中心状态（坐席列表、会话、队列）可使用 **Pinia**（`npx nuxi module add pinia`）。
- 在 `app.vue` 或布局中用 `await callOnce(store.fetch)` 做 SSR 初始化。
- 与 `useState` 二选一为主力，避免同一数据两套缓存。

### 8.5 共享 composable 模式

```ts
// app/composables/useLocale.ts
export const useLocale = () => useState<string>('locale', () => 'zh-CN')
```

---

## 9. Server（服务端 / Nitro）

文档：[Server](https://nuxt.com/docs/4.x/getting-started/server)

### 9.1 能力边界

- **Nitro** 提供 `server/api`、`server/routes`、`server/middleware`、部署预设（含 Vercel）。
- API 与 Vue 路由中间件**完全分离**。

### 9.2 API 路由

```ts
// server/api/agents/index.get.ts  → GET /api/agents
export default defineEventHandler(async (event) => {
  return { agents: [] }
})

// server/api/calls/[id].get.ts    → GET /api/calls/:id
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  return { id }
})
```

- 返回类型：JSON / text / stream 均可；错误用 `createError({ statusCode: 404, statusMessage: 'Not Found' })`。

### 9.3 服务端中间件

```ts
// server/middleware/log.ts — 每个请求执行
export default defineEventHandler((event) => {
  // 鉴权、日志等
})
```

### 9.4 `routeRules`（混合渲染）

```ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },
    '/api/**': { cors: true },
    '/dashboard/**': { ssr: true },
  },
})
```

### 9.5 与前端协作

- 页面数据：优先 `useFetch('/api/...')` 同源请求
- 敏感密钥：仅 `runtimeConfig` 服务端字段，**禁止**暴露到 `runtimeConfig.public`

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    twilioAuthToken: '', // 仅服务端
    public: {
      apiBase: '/api',
    },
  },
})
```

---

## 10. 本仓库已安装能力（勿重复安装）

| 能力 | 版本/模块 | 说明 |
|------|-----------|------|
| Nuxt | 4.x | `app/` 目录结构 |
| Tailwind | 4.x + `@tailwindcss/vite` | 勿改用 `@nuxtjs/tailwindcss` v6 旧方案 |
| shadcn-vue | `shadcn-nuxt@2.7.3` | 组件：`npx shadcn-vue@latest add <name>` |
| SSR 宽度 | `app/plugins/ssr-width.ts` | 配合 `@vueuse/core`，避免移动端 hydration 问题 |

添加 shadcn 组件：

```bash
npx shadcn-vue@latest add button card dialog input table
```

---

## 11. 常见反模式速查

| 反模式 | 正确做法 |
|--------|----------|
| 在 `app.vue` 写所有页面内容 | 使用 `app/pages/` + `<NuxtPage />` |
| `setup` 里 `$fetch` 拉列表 | `useFetch` / `useAsyncData` |
| 模块顶层 `ref` 当全局状态 | `useState` / Pinia |
| 图片放 `assets` 却用 `/assets/x.png` | 改放 `public/` 或 import 资源 |
| 路由鉴权写在 `server/middleware` 期望拦截页面 | 使用 `app/middleware` |
| 重复引入 Tailwind 入口 CSS | 只保留 `tailwind.css` 一处 |
| 手写 UI 复制 shadcn 源码 | CLI 添加并扩展 |

---

## 12. 推荐开发流程（AI 逐步执行）

1. **路由**：在 `app/pages/` 创建页面 → `definePageMeta`（布局、中间件、校验）
2. **布局**：如需侧栏/顶栏，更新 `app/layouts/*.vue`
3. **组件**：业务逻辑放 `app/components/`；UI 用 shadcn CLI
4. **数据**：`server/api/` 实现接口 → 页面 `useFetch`
5. **状态**：跨页共享用 `app/composables/` + `useState` 或 Pinia
6. **样式**：Tailwind + shadcn 变量，必要时 scoped CSS
7. **验证**：`yarn dev` 本地 → `yarn build` 确保 Vercel 可构建

---

## 13. 文档维护

- Nuxt 小版本升级后，核对上述官方链接是否有 breaking changes。
- 新增全局模块（i18n、auth）时，在本文件 **第 1 节目录** 与 **第 10 节** 同步更新。
- 产品/UI 规则变更只改 `AICodingRule.md`，不与本文件混写。

---

*文档版本：1.0 · 基于 Nuxt 4.4 与项目初始脚手架整理*
