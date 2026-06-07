# Eazzy Omini CC — Aurora App Design System (Work Area)

> **适用范围**: 登录后的所有工作台页面（`app/layouts/app.vue` 包裹的区域），包括 Call、Webchat、Mail、Tickets、Customer、Knowledge、Reports、Monitor、Campaign、Settings 等 11 个模块。  
> **设计哲学**: "Aurora 延伸，密度优先" — 继承首页 `DESIGN_AURORA.md` 的 Zinc/Black 主色与低强度 Aurora 氛围，但针对高密度数据工作区做专项适配：禁用大光晕 blob、启用语义状态色系统、严格的信息层级压缩。  
> **与首页的关系**: 首页用完整 3-blob 漂移动画 + 玻璃态大卡片；工作台只保留极低透明度 Aurora 背景噪点，交互元素 100% Zinc。  
> **品牌辅助色**: `#1276cf` (Ocean Blue) / `#00abec` (Sky Cyan) / `#0de3ec` (Electric Teal) — 工作台点缀色（按钮高亮、激活态、Link），不作主色。  
> **版本**: v1.0 — 2026.05 初始版。

---

## 1. 色彩系统

### 1.1 基础中性色（全部使用 zinc，禁止 slate/gray）

| Token | Light Mode | Dark Mode | 用途 |
|---|---|---|---|
| `--app-bg` | `bg-zinc-50` (#F4F4F5) | `bg-zinc-950` (#09090B) | 页面底色 |
| `--app-surface` | `bg-white` | `bg-zinc-900` | 面板/卡片底色 |
| `--app-surface-raised` | `bg-zinc-50` | `bg-zinc-800/60` | 悬浮卡片、弹层 |
| `--app-border` | `border-zinc-200` | `border-zinc-800` | 默认边框 |
| `--app-border-subtle` | `border-zinc-100` | `border-zinc-900` | 细分隔线 |
| `--text-strong` | `text-zinc-900` | `text-zinc-50` | 标题、关键信息 |
| `--text-body` | `text-zinc-700` | `text-zinc-300` | 正文 |
| `--text-muted` | `text-zinc-500` | `text-zinc-400` | 辅助说明、时间戳 |
| `--text-placeholder` | `text-zinc-400` | `text-zinc-600` | 输入框占位符 |

### 1.2 主交互色（Zinc Ink）

```
Light Mode:
  Primary button:   bg-zinc-900 text-white hover:bg-zinc-800
  Active tab:       border-b-2 border-zinc-900 text-zinc-900
  Focus ring:       ring-2 ring-zinc-900/20

Dark Mode:
  Primary button:   bg-zinc-50 text-zinc-900 hover:bg-white
  Active tab:       border-b-2 border-zinc-50 text-zinc-50
  Focus ring:       ring-2 ring-zinc-50/20
```

### 1.3 品牌辅助色（工作台专用点缀）

| 色值 | 名称 | 用途 |
|---|---|---|
| `#1276cf` | Ocean Blue | Import/Export 等数据吞吐按钮、Link 色、进度条 |
| `#00abec` | Sky Cyan | 标签、Badge 高亮、图表辅助 |
| `#0de3ec` | Electric Teal | hover 渐变、图表轨迹、高亮 chip |

```css
/* Tailwind arbitrary values */
.text-brand-blue    { color: #1276cf; }
.bg-brand-blue      { background-color: #1276cf; }
.text-brand-cyan    { color: #00abec; }
.bg-brand-cyan      { background-color: #00abec; }
.text-brand-teal    { color: #0de3ec; }
```

> **注意**: 品牌辅助色只用于非主 CTA 的次要按钮（如 Import/Export）和数据可视化，禁止替代 `bg-zinc-900` 作为主操作按钮色。

### 1.4 语义状态色（Status Colors）

所有状态 badge/chip 统一用 Tailwind 语义色，**禁止用品牌辅助色**：

| 状态 | Light | Dark | 示例 |
|---|---|---|---|
| 成功/完成 | `bg-emerald-100 text-emerald-700` | `bg-emerald-500/15 text-emerald-400` | Complete, Resolved |
| 警告/待处理 | `bg-amber-100 text-amber-700` | `bg-amber-500/15 text-amber-400` | Pending, Follow up |
| 错误/紧急 | `bg-rose-100 text-rose-700` | `bg-rose-500/15 text-rose-400` | Failed, Much Urgent |
| 信息/处理中 | `bg-sky-100 text-sky-700` | `bg-sky-500/15 text-sky-400` | Processing, Contacted |
| 中性/一般 | `bg-zinc-100 text-zinc-600` | `bg-zinc-800 text-zinc-400` | Normal, No Results |
| 转接 | `bg-blue-100 text-blue-700` | `bg-blue-500/15 text-blue-400` | Transferred |
| 关闭 | `bg-zinc-200 text-zinc-500` | `bg-zinc-700/60 text-zinc-500` | Closed |

### 1.5 客户分类徽标色（5 类）

| 分类 | Light | Dark |
|---|---|---|
| VVVIP | `bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-300/60` | `bg-amber-500/20 text-amber-300 border border-amber-500/30` |
| VIP | `bg-amber-100 text-amber-700` | `bg-amber-500/15 text-amber-400` |
| Normal | `bg-zinc-100 text-zinc-700` | `bg-zinc-800 text-zinc-400` |
| Registered | `bg-emerald-100 text-emerald-700` | `bg-emerald-500/15 text-emerald-400` |
| Non-registered | `bg-zinc-200 text-zinc-500` | `bg-zinc-700/60 text-zinc-500` |

### 1.6 工单优先级色（3 级）

| 优先级 | 文案 | Light | Dark |
|---|---|---|---|
| `normal` | Normal | `text-zinc-600` | `text-zinc-400` |
| `urgent` | !Urgent | `text-amber-600` | `text-amber-400` |
| `much_urgent` | !!Much urgent | `text-rose-600` | `text-rose-400` |

### 1.7 Aurora 背景（极低强度，仅氛围）

工作台保留一个极淡的 Aurora 背景噪点，但**严禁大 blob 动画**：

```css
/* app/layouts/app.vue 背景处理 */
.app-aurora-subtle {
  background-image:
    radial-gradient(ellipse 60% 40% at 90% 10%, rgba(191, 219, 254, 0.06) 0%, transparent 70%),
    radial-gradient(ellipse 40% 30% at 5% 90%, rgba(165, 243, 252, 0.04) 0%, transparent 70%);
}
.dark .app-aurora-subtle {
  background-image:
    radial-gradient(ellipse 60% 40% at 90% 10%, rgba(59, 130, 246, 0.04) 0%, transparent 70%),
    radial-gradient(ellipse 40% 30% at 5% 90%, rgba(6, 182, 212, 0.03) 0%, transparent 70%);
}
```

---

## 2. 排版系统

### 字体栈

```css
font-family: 'Geist Variable', ui-sans-serif, system-ui, sans-serif;
/* Burmese locale 额外注入 */
[lang="my"] { font-family: 'Pyidaungsu', 'Noto Sans Myanmar', sans-serif; }
```

### 层级规范

| 角色 | Size | Weight | 用途 |
|---|---|---|---|
| 模块标题 | `text-xl` | `font-semibold` | 页面主标题（如 "Me Test"） |
| 列表项名称 | `text-sm` | `font-medium` | 列表行主文本 |
| 辅助信息 | `text-xs` | `font-normal` | 时间戳、备注、Tag |
| 表头 | `text-xs` | `font-medium uppercase tracking-wide` | 表格表头 |
| 空态文案 | `text-sm` | `font-normal` | Empty state 提示 |
| 错误提示 | `text-xs` | `font-normal` | 表单验证 |
| 徽标/Badge | `text-xs` | `font-semibold` | 状态 chip |
| 数字/统计 | `text-2xl` | `font-bold tabular-nums` | 统计卡片 |

---

## 3. 布局系统

### 3.1 工作台整体布局

```
┌──────────────────────────────────────────────────────────────┐
│  顶部 Softphone Dock (h-12, sticky top-0, z-50)              │
├─────────────┬────────────────────────────────────────────────┤
│ 左侧导航     │  主内容区                                      │
│ w-14        │  flex-1 overflow-hidden                         │
│ (icon-only) │                                                 │
│  sticky     │  各模块自行实现多栏布局                          │
└─────────────┴────────────────────────────────────────────────┘
```

- **顶部 Dock 高度**: `h-12` (48px)，固定，`z-50`
- **左侧导航宽度**: `w-14` (56px)，仅图标，hover 时 tooltip 显示名称
- **主内容区**: `calc(100vh - 48px)` 高度，`overflow-hidden`，内部各模块独立滚动

### 3.2 典型三栏布局（Webchat/Mail/Tickets）

```
┌──────────────┬──────────────────────────────┬──────────────┐
│ 左栏 List    │ 中栏 Main                     │ 右栏 Detail  │
│ w-64 (256px) │ flex-1                        │ w-80 (320px) │
│ border-r     │                               │ border-l     │
│ overflow-y   │                               │ overflow-y   │
└──────────────┴──────────────────────────────┴──────────────┘
```

- 响应式：`< 1024px` 时左栏隐藏（变为侧边抽屉），`< 1280px` 时右栏折叠（变为底部 Sheet）

### 3.3 典型二栏布局（Customer/Knowledge）

```
┌──────────────┬─────────────────────────────────────────────┐
│ 左栏          │ 右侧详情/内容区                              │
│ w-72 (288px) │ flex-1                                       │
│ border-r     │                                              │
└──────────────┴─────────────────────────────────────────────┘
```

### 3.4 间距规范

| 场景 | 值 |
|---|---|
| 模块内页边距 | `p-4` (16px) |
| 列表行内边距 | `px-3 py-2` |
| 卡片内边距 | `p-4` |
| 表单字段间距 | `space-y-4` |
| 操作按钮间距 | `gap-2` |
| 左侧导航图标间距 | `py-2` |

---

## 4. 组件样式规范

### 4.1 左侧导航 (AppSidebar)

```html
<!-- 侧边栏容器 -->
<nav class="w-14 bg-zinc-900 dark:bg-zinc-950 flex flex-col items-center py-3 gap-1 border-r border-zinc-800">
  <!-- 单个导航项 -->
  <button class="w-10 h-10 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
  <!-- 激活态 -->
  <button class="w-10 h-10 rounded-lg flex items-center justify-center bg-zinc-800 text-zinc-100">
```

### 4.2 顶部 Softphone Dock

```html
<header class="h-12 bg-zinc-900 dark:bg-zinc-950 border-b border-zinc-800 flex items-center px-4 gap-3 sticky top-0 z-50">
```

### 4.3 列表行

```html
<!-- 普通行 -->
<div class="flex items-center px-3 py-2.5 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/60 border-b border-zinc-100 dark:border-zinc-800 transition-colors">
<!-- 选中行 -->
<div class="flex items-center px-3 py-2.5 bg-zinc-100/80 dark:bg-zinc-900/40 border-l-2 border-zinc-900 dark:border-zinc-100">
```

### 4.4 Tab 栏

```html
<!-- Tab 容器 -->
<div class="flex border-b border-zinc-200 dark:border-zinc-800">
  <!-- 未激活 -->
  <button class="px-4 py-2.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
  <!-- 激活 -->
  <button class="px-4 py-2.5 text-sm font-medium text-zinc-900 dark:text-zinc-50 border-b-2 border-zinc-900 dark:border-zinc-50">
```

### 4.5 操作按钮组

```html
<!-- 主操作按钮 (Zinc Black) -->
<button class="h-8 px-3 rounded-md bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-white transition-colors">

<!-- 次要操作按钮 (Ghost) -->
<button class="h-8 px-3 rounded-md text-zinc-600 text-sm font-medium hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors">

<!-- 数据操作按钮 (Brand Blue — Import/Export) -->
<button class="h-8 px-3 rounded-md bg-[#1276cf] text-white text-sm font-medium hover:bg-[#0f63b8] transition-colors">

<!-- 危险操作按钮 (Ghost Red) -->
<button class="h-8 px-3 rounded-md text-rose-600 text-sm font-medium hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors">
```

### 4.6 输入框

```html
<input class="h-8 w-full rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 px-3 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-50/20 focus:border-zinc-400 dark:focus:border-zinc-500 transition">

<!-- 错误态 -->
<input class="... border-rose-400 focus:border-rose-500 focus:ring-rose-200/60">
<p class="text-xs text-rose-600 dark:text-rose-400 mt-1">错误提示</p>
```

### 4.7 状态 Badge/Chip

```html
<!-- 通用 badge 结构 -->
<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold {colorClass}">
  状态文本
</span>
```

### 4.8 空态 (EmptyState)

```html
<div class="flex flex-col items-center justify-center py-16 gap-3">
  <Icon name="lucide:inbox" class="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
  <p class="text-sm text-zinc-400 dark:text-zinc-500">暂无数据</p>
</div>
```

### 4.9 操作日志 Timeline 点

```html
<!-- 时间轴节点 -->
<div class="relative flex gap-4">
  <div class="mt-1.5 h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-600 ring-2 ring-zinc-100 dark:ring-zinc-800 flex-shrink-0"></div>
  <div>
    <div class="text-xs text-zinc-500 dark:text-zinc-400 tabular-nums w-20">03-02 18:47</div>
    <p class="text-sm font-medium text-zinc-800 dark:text-zinc-200">操作标题</p>
    <p class="text-xs text-zinc-500 dark:text-zinc-400">操作描述</p>
  </div>
</div>
```

### 4.10 面包屑 (Breadcrumb)

```html
<nav class="flex items-center gap-1 text-sm">
  <span class="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 cursor-pointer">Catalog browsing</span>
  <span class="text-zinc-300 dark:text-zinc-700">/</span>
  <span class="text-zinc-900 dark:text-zinc-100 font-medium">当前层级</span>
</nav>
```

---

## 5. 交互动画规范

### 5.1 100ms 视觉反馈原则（来自 AICodingRule.md）

所有交互元素在用户操作后必须在 100ms 内有视觉反馈：

- **按钮点击**: 立即进入 Loading 状态（FlowButton.vue）
- **列表行点击**: 立即高亮 (`bg-zinc-100`)
- **Tab 切换**: 即时切换，无延迟
- **弹层打开**: `duration-200` 过渡
- **展开/折叠**: `duration-150` 过渡

### 5.2 过渡动画标准

```css
/* 通用 hover 过渡 */
transition-colors duration-150

/* 面板展开/收起 */
transition-all duration-200 ease-out

/* 弹层进入/离开 */
/* 进入: opacity-0 scale-95 → opacity-100 scale-100, duration-200 */
/* 离开: opacity-100 scale-100 → opacity-0 scale-95, duration-150 */

/* 骨架屏脉冲 */
animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded
```

### 5.3 加载状态

- **页面跳转**: `NewsLoader.vue`（全屏顶部进度条 + 品牌色）
- **按钮操作**: `FlowButton.vue`（按钮内 spinner + 文字变灰 + disabled）
- **列表加载**: 骨架屏（3 行 `animate-pulse` 行）
- **内容区加载**: 居中 spinner `text-zinc-400`

---

## 6. 响应式规范

### 断点

| 名称 | 宽度 | 工作台适配 |
|---|---|---|
| Mobile (base) | < 640px | 左侧导航收起为底部 Tab Bar；中栏全屏 |
| Tablet (sm) | 640px–1023px | 左侧导航 icon-only；右侧 Detail 折叠为 Sheet |
| Desktop (lg) | 1024px–1279px | 三栏标准布局；右栏 w-72 |
| Wide (xl+) | ≥ 1280px | 三栏宽松布局；右栏 w-80 |

### 触控目标

- 所有可点击元素最小 `h-11` (44px)
- 列表行 `py-2.5` 在密集内容下放宽为 `py-3`
- 图标按钮最小 `h-9 w-9`

---

## 7. 暗色模式规范

**强制要求**：每个颜色类必须同时提供 `dark:` 变体。

### 工作台暗色特性

- **背景层级**：`bg-zinc-950` (页面) → `bg-zinc-900` (面板) → `bg-zinc-800/60` (悬浮)
- **边框**：统一 `border-zinc-800`，极细分隔用 `border-zinc-900`
- **文字对比度**：强文字 `text-zinc-50`，正文 `text-zinc-300`，辅助 `text-zinc-400`
- **左侧导航暗色**：始终为 `bg-zinc-900 dark:bg-zinc-950`（昼夜一致的深色导航）

---

## 8. 禁止事项（继承 DESIGN_AURORA.md + 工作台扩展）

### 继承自首页规范

- **禁止** `violet / purple / pink / fuchsia` 作为任何交互色
- **禁止** `bg-black`（用 `bg-zinc-950`）
- **禁止** 混用 `slate / gray`（统一用 `zinc`）
- **禁止** Aurora blob 颜色用于 UI 组件

### 工作台专项禁止

- **禁止** 在数据密集区域（列表、表格、详情面板）使用大 blob 背景动画
- **禁止** 在工作台主操作按钮上使用品牌辅助色（`#1276cf` 等）替代 `bg-zinc-900`
- **禁止** 在左侧导航使用亮色（导航保持深色以建立视觉层级锚点）
- **禁止** `backdrop-blur` 超过 3 个同时出现（GPU 性能）
- **禁止** 超过 6px 的圆角用于列表行（保持紧凑感）

---

## 9. AI 开发快查表（每次生成工作台组件前检查）

```
□ 是否使用 zinc 中性色（不是 slate/gray）？
□ 是否同时写了 dark: 变体？
□ 主操作按钮是否用 bg-zinc-900（不是品牌蓝）？
□ 状态 Badge 是否用语义色板（§1.4）？
□ 列表行是否有选中态（border-l-2 border-zinc-900）？
□ 触控目标是否 ≥ 44px？
□ 按钮是否接入 FlowButton.vue（异步操作）？
□ 页面跳转是否接入 NewsLoader.vue？
□ 表单错误是否有 border-rose-400 + 错误文案？
□ 空态是否有 EmptyState 组件？
□ 面包屑路径是否使用 BreadcrumbPath 组件？
□ i18n key 是否追加到三语言文件末尾？
□ JSON 中是否有中文标点（必须清除）？
```
