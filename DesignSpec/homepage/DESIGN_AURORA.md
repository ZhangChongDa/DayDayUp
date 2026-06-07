# EazzyAI — Ink & Cloud Design System (Homepage + Marketing Pages)

> **适用范围**: 首页 (`pages/index.vue`)、定价页 (`pages/pricing.vue`)、动态页 (`pages/news.vue`) 及所有 `components/home/*` 组件。  
> **设计哲学**: "Black is ink, Aurora is cloud" — 黑色主导交互，Aurora 蓝青靛光晕营造科技感，通过边框呼吸 + 微阴影 + 留白建立高级质感。对标 Notion / ChatGPT 的极简科技风。  
> **主色调**: **Zinc/Black** 为第一交互色，Aurora 蓝 × 青 × 靛为视觉氛围色，**不使用 violet / purple / pink**。  
> **中性色系**: 统一使用 **Zinc** (`zinc-50 ~ zinc-950`)，禁止混用 slate / gray。  
> **版本**: v3.0 — 2026.05 Ink & Cloud 重构版本。

---

## 1. Visual Theme & Atmosphere

EazzyAI's homepage is an **Aurora-first, Ink-premium** canvas. Three signature gestures define the visual identity:

1. **Aurora Mesh Gradient** — Slow-breathing, multi-stop radial gradient blobs. Color palette: **Blue (`#BFDBFE`) × Cyan (`#A5F3FC`) × Indigo (`#C7D2FE`)** in Light Mode; vivid **Blue (`#3B82F6`) × Cyan (`#06B6D4`) × Indigo (`#6366F1`)** in Dark Mode. Aurora provides **atmospheric ambiance only** — never dominates interactive elements.

2. **Glassmorphism Widget** — The hero interaction panel floats above the Aurora background with frosted-glass surface. Dark: translucent near-black with white hairline border. Light: pure white with layered soft shadow. Interactive accent uses **zinc-900 (black)** for active states — not color.

3. **Terminal State Special** — When AI is generating, the widget flips to a dark terminal aesthetic (`zinc-950` background, `emerald-400` monospaced text), regardless of page mode.

**Key Characteristics:**
- `#09090B` (zinc-950) Dark canvas vs `#F8FAFC` (zinc-50 equivalent) Light canvas
- Aurora Mesh: 3-stop radial gradient, 30s slow-drift CSS animation
- PRIMARY interactive: `bg-zinc-900 text-white` (Light) / `bg-white text-zinc-900` (Dark)
- H1 Typewriter Gradient: zinc monochrome `from-zinc-900 via-zinc-700 to-zinc-500` (Light) / `from-zinc-50 via-zinc-300 to-zinc-500` (Dark)
- Glassmorphism Widget: `backdrop-blur-2xl` + mode-aware surface + hairline border
- CLS = 0: all state-switching containers have `min-h` locked
- Subtle Grid overlay: 64px dark grid lines, Dark Mode only (opacity 3%)

---

## 2. Color Palette & Roles

### Light Mode

| Token | Value | Tailwind | Role |
|-------|-------|----------|------|
| `--bg-base` | `#F8FAFC` | `bg-[#F8FAFC]` | Page background |
| `--bg-elevated` | `#FFFFFF` | `bg-white` | Card / Widget surface |
| `--bg-glass` | `rgba(255,255,255,0.90)` | `bg-white/90` | Glassmorphism surface |
| `--border-glass` | `rgba(228,228,231,0.80)` | `border-zinc-200/80` | Glass hairline border |
| `--text-strong` | `#0A0A0A` | `text-zinc-950` | H1, H2, card titles |
| `--text-body` | `#3F3F46` | `text-zinc-700` | Body paragraphs |
| `--text-muted` | `#71717A` | `text-zinc-500` | Labels, secondary text |
| `--aurora-1` | `#BFDBFE` | `blue-200` | Aurora blob 1 (sky blue) |
| `--aurora-2` | `#A5F3FC` | `cyan-200` | Aurora blob 2 (mint cyan) |
| `--aurora-3` | `#C7D2FE` | `indigo-200` | Aurora blob 3 (soft indigo) |
| `--aurora-opacity` | `0.55` | `opacity-[0.55]` | Blob opacity in Light Mode |
| `--accent-primary` | `#18181B` | `bg-zinc-900` | CTA buttons, active tabs |
| `--accent-hover` | `#27272A` | `hover:bg-zinc-800` | Button hover |
| `--accent-text` | `#FFFFFF` | `text-white` | Button text on dark button |
| `--kicker-bg` | `#F4F4F5` | `bg-zinc-100` | Kicker badge background |
| `--kicker-text` | `#52525B` | `text-zinc-600` | Kicker badge text |
| `--shadow-card` | `0 20px 60px -20px rgba(15,23,42,0.10), 0 4px 16px -4px rgba(15,23,42,0.05)` | shadow custom | Widget card shadow |

### Dark Mode

| Token | Value | Tailwind | Role |
|-------|-------|----------|------|
| `--bg-base` | `#09090B` | `bg-zinc-950` | Page background |
| `--bg-elevated` | `rgba(255,255,255,0.04)` | `bg-white/[0.04]` | Glass surface base |
| `--bg-glass` | `rgba(255,255,255,0.06)` | `bg-white/[0.06]` | Glassmorphism widget surface |
| `--border-glass` | `rgba(255,255,255,0.09)` | `border-white/[0.09]` | Glass hairline border |
| `--text-strong` | `#FAFAFA` | `text-zinc-50` | H1, H2, card titles |
| `--text-body` | `#D4D4D8` | `text-zinc-300` | Body paragraphs |
| `--text-muted` | `#A1A1AA` | `text-zinc-400` | Labels, secondary text |
| `--aurora-1` | `#3B82F6` | `blue-500` | Aurora blob 1 (vivid blue) |
| `--aurora-2` | `#06B6D4` | `cyan-500` | Aurora blob 2 (vivid cyan) |
| `--aurora-3` | `#6366F1` | `indigo-500` | Aurora blob 3 (vivid indigo) |
| `--aurora-opacity` | `0.40` | `opacity-[0.40]` | Blob opacity in Dark Mode |
| `--accent-primary` | `#FAFAFA` | `bg-zinc-50` | CTA buttons in Dark Mode |
| `--accent-hover` | `#E4E4E7` | `hover:bg-zinc-200` | Button hover in Dark Mode |
| `--accent-text` | `#09090B` | `text-zinc-950` | Button text on light button |
| `--kicker-bg` | `rgba(255,255,255,0.08)` | `bg-white/[0.08]` | Kicker badge background |
| `--kicker-text` | `#A1A1AA` | `text-zinc-400` | Kicker badge text |
| `--shadow-card` | `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)` | shadow custom | Widget card shadow |

### Terminal State Colors (mode-agnostic)

| Token | Value | Tailwind | Role |
|-------|-------|----------|------|
| `--terminal-bg` | `#09090B` | `bg-zinc-950` | Terminal window background |
| `--terminal-text` | `#34D399` | `text-emerald-400` | Streaming typewriter text |
| `--terminal-dim` | `#6EE7B7` | `text-emerald-300` | Skeleton pulse / dim text |
| `--terminal-cursor` | `#10B981` | `text-emerald-500` | Blinking cursor |

### Semantic Colors (shared)

| Token | Value | Tailwind | Role |
|-------|-------|----------|------|
| `--success` | `#10B981` | `text-emerald-500` | Completed state, checkmarks |
| `--warning` | `#F59E0B` | `text-amber-500` | Coming soon badges |
| `--destructive` | `#EF4444` | `text-red-500` | Negative indicators |
| `--neutral-line` | `rgba(228,228,231,0.50)` | `border-zinc-200/50` | Section dividers (light) |
| `--neutral-line-dark` | `rgba(63,63,70,0.50)` | `border-zinc-700/50` | Section dividers (dark) |

---

## 3. Typography Rules

### Font Stack
- **Display / H1**: System `ui-sans-serif` → Tailwind default sans. Use `font-bold tracking-tight` at display sizes.
- **Body**: Same sans stack, `font-normal`, generous `leading-relaxed`.
- **Terminal**: `font-mono` (system monospace). Used exclusively inside Terminal State.
- **Kicker / Badge**: `font-semibold text-xs uppercase tracking-widest`.

### Hierarchy

| Role | Size | Weight | Leading | Tracking | Notes |
|------|------|--------|---------|----------|-------|
| Display H1 prefix | `text-[1.6rem]` → `text-[2.25rem]` | `font-bold` | `leading-tight` | `tracking-tight` | Fixed prefix line |
| Display H1 typewriter | `text-[2.25rem]` → `text-[3.5rem]` | `font-extrabold` | `leading-tight` | `tracking-[-0.03em]` | Cycling text with gradient |
| H2 Section | `text-3xl` → `text-5xl` | `font-bold` | `leading-tight` | `tracking-tight` | |
| H3 Card | `text-xl` → `text-2xl` | `font-semibold` | `leading-snug` | `tracking-tight` | |
| Body Large | `text-sm` → `text-[17px]` | `font-normal` | `leading-relaxed` | normal | Subtitle / H2 sub-copy |
| Body | `text-sm` → `text-base` | `font-normal` | `leading-relaxed` | normal | Card body |
| Kicker | `text-[11px]` | `font-semibold` | `leading-none` | `tracking-[0.15em]` | UPPERCASE badge above H1 |
| Label | `text-sm` | `font-medium` | `leading-none` | normal | UI labels |
| Terminal | `text-sm` → `text-base` | `font-mono font-normal` | `leading-relaxed` | normal | Terminal typewriter output |
| Badge / Chip | `text-xs` | `font-semibold` | `leading-none` | normal | Platform pills |

### Typewriter H1 Specification
- **Fixed prefix** (EN): `"Your AI Marketing Team, "`
- **Fixed prefix** (ZH): `"你的AI营销团队，"`
- **Cycling segments** (2.5s interval):
  1. `"Built for Cross-Border Brands."` / `"专为出海品牌打造。"`
  2. `"Built for Local Businesses."` / `"专为本地商户打造。"`
  3. `"Built for Marketing Agencies."` / `"专为营销机构打造。"`
- **Gradient Light**: `bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 bg-clip-text text-transparent`
- **Gradient Dark**: `bg-gradient-to-r from-zinc-50 via-zinc-300 to-zinc-500 bg-clip-text text-transparent`
- **CLS prevention**: Wrap typewriter span in `min-h-[70px] sm:min-h-[86px] lg:min-h-[108px]`

---

## 4. Component Stylings

### Aurora Background (`AuroraBackground.vue`)
```css
/* 3-blob Mesh Gradient — CSS only, no canvas/WebGL */
.aurora-bg { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.aurora-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: aurora-drift 30s ease-in-out infinite;
  opacity: 0.55; /* Light mode — soft blue/cyan ambiance */
}
:global(.dark) .aurora-blob { opacity: 0.40; }

/* Blob 1 — top-right | Light: sky blue | Dark: vivid blue */
.aurora-blob-1 { width:55vw; height:55vw; top:-15%; right:-10%;
  background: radial-gradient(ellipse, #BFDBFE, transparent 70%); }
:global(.dark) .aurora-blob-1 { background: radial-gradient(ellipse, #3B82F6, transparent 70%); }

/* Blob 2 — bottom-left | Light: mint cyan | Dark: vivid cyan */
.aurora-blob-2 { width:45vw; height:45vw; bottom:-10%; left:-5%;
  background: radial-gradient(ellipse, #A5F3FC, transparent 70%); animation-delay:-10s; }
:global(.dark) .aurora-blob-2 { background: radial-gradient(ellipse, #06B6D4, transparent 70%); }

/* Blob 3 — center-right | Light: soft indigo | Dark: vivid indigo */
.aurora-blob-3 { width:35vw; height:35vw; top:40%; right:20%;
  background: radial-gradient(ellipse, #C7D2FE, transparent 70%);
  animation-delay:-20s; opacity:0.40; }
:global(.dark) .aurora-blob-3 { background: radial-gradient(ellipse, #6366F1, transparent 70%); opacity:0.40; }
```

### Magic Widget Card (`MagicWidget.vue`)
- **Container**: Fixed `min-h-[480px] md:min-h-[520px]` to prevent CLS.
- **Outer card surface**:
  - Light: `bg-white/90 border border-zinc-200/80 backdrop-blur-2xl rounded-[28px] shadow-[0_20px_60px_-20px_rgba(15,23,42,0.10),_0_4px_16px_-4px_rgba(15,23,42,0.05)]`
  - Dark: `bg-white/[0.06] border border-white/[0.09] backdrop-blur-2xl rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.4),_0_0_0_1px_rgba(255,255,255,0.08)]`
- **Tab bar** (Post / Video Script):
  - Pill container: `bg-zinc-100/90 dark:bg-black/40 rounded-full p-1`
  - Active tab: `bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-full px-4 py-1.5 text-sm font-semibold`
  - Inactive: `text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200`
- **Input area**: `bg-zinc-50 dark:bg-black/30 border border-zinc-200/80 dark:border-white/10 rounded-xl focus:border-zinc-400 dark:focus:border-white/30`
- **Magic Chips**: `px-2.5 py-1 rounded-full border bg-zinc-100/80 dark:bg-white/[0.05] border-zinc-200/60 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-300 text-xs font-medium cursor-pointer hover:bg-zinc-200 dark:hover:bg-white/[0.09] hover:border-zinc-300 transition-colors`
- **Generate CTA button**: `w-full h-14 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_32px_rgba(0,0,0,0.25)] transition-all duration-300`

### Terminal State (Widget states 1 & 2)
- `bg-zinc-950 rounded-xl p-6 font-mono text-emerald-400 text-sm leading-relaxed`
- Skeleton steps: `animate-pulse text-emerald-300/60`
- Streaming text: character-by-character append — no `innerHTML`, use `textContent` append
- Blinking cursor: `::after { content: '|'; animation: blink 1s step-end infinite; }`

### Paywall State
- Blurred content: `filter: blur(8px); user-select: none; pointer-events: none;`
- Overlay: `bg-white/[0.08] dark:bg-white/[0.05] backdrop-blur-xl rounded-2xl border border-zinc-200/40 dark:border-white/10`
- Primary CTA: full-width, height 52px, `rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900`

### Navbar (`ZhdNavbar.vue`)
- **Homepage fixed state**: `fixed top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-white/[0.06]`
- **Non-homepage state**: `relative bg-[#F8FAFC] dark:bg-zinc-950 border-b border-zinc-200/50 dark:border-zinc-800`
- **Nav links**: `text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white`
- **Active nav link**: `text-zinc-900 dark:text-white font-semibold` with bottom underline `bg-zinc-900 dark:bg-white`
- **CTA button** (unauthenticated): `bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-full`
- **Brand name**: `text-zinc-900 dark:text-white font-bold`

### Cards (Section 4 — MarketingBrainCards)
- `group rounded-2xl p-6 border cursor-pointer transition-all duration-300`
- Idle: `border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60`
- Hover/Expanded: `border-zinc-400/60 dark:border-zinc-600/50 shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)]`

### Social Proof (Section 2 — SocialProofMarquee)
- **Section background**: `bg-[#F8FAFC] dark:bg-zinc-950`
- Engine pill cards: `bg-white border-zinc-200/90 dark:bg-zinc-800/70 dark:border-zinc-700/50`
- Metrics cards: same as engine pills + icon container `bg-zinc-100 dark:bg-zinc-800`
- Logo marquee fade masks: `from-[#F8FAFC] dark:from-zinc-950`
- Animation: `scroll-left 30s linear infinite`; logo items: `grayscale opacity-50 hover:grayscale-0 hover:opacity-100`

### Before/After Showcase (Section 3)
- Tab switcher: pill-style, zinc active state (`bg-zinc-900 text-white dark:bg-white dark:text-zinc-900`)
- Section background: `bg-[#F8FAFC] dark:bg-zinc-950`

### Pricing Matrix (Section 6 / `pages/pricing.vue`)
- Page background: `bg-[#F8FAFC] dark:bg-zinc-950`
- Standard columns: `bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800`
- **Champion column**: `border-2 border-zinc-900 dark:border-white shadow-[0_0_0_4px_rgba(9,9,11,0.08)] scale-[1.02] rounded-2xl`
- Highlight badge: `bg-zinc-900 dark:bg-white text-white dark:text-zinc-900`
- Toggle active state: `bg-zinc-900 text-white dark:bg-white dark:text-zinc-900`
- Section note: `pb-32` to clear sticky CTA overlay

### News / Blog (`pages/news.vue`)
- Page background: `bg-[#F8FAFC] dark:bg-zinc-950`
- Article cards: `bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl`
- Article card hover: `hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)]`
- Category badge: `bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300`
- Title hover: `group-hover:text-zinc-950 dark:group-hover:text-white`
- Placeholder cover: `bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700`

### Mobile Sticky CTA (`StickyFooterCta.vue`)
- `fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800`
- CTA button: `bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-full h-14 w-full`
- Bottom safe area: `padding-bottom: max(12px, env(safe-area-inset-bottom))`

---

## 5. Layout Principles

### Desktop (≥ 1024px) — Hero Section
```
┌─────────────────────────────────────────────────────────────┐
│  45%  Value Proposition         │  55%  Magic Widget        │
│  ─────────────────────────────  │  ─────────────────────    │
│  [Kicker badge — zinc neutral]  │  ┌────────────────────┐   │
│  H1 prefix (smaller)            │  │  Tab: Post | Video │   │
│  H1 typewriter (zinc gradient)  │  │  Magic Chips       │   │
│  H2 Subtitle                    │  │  Input + Options   │   │
│  Trust badges (3 cols)          │  │  [Generate CTA]    │   │
│                                 │  └────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Grid: `grid lg:grid-cols-2 gap-10 lg:gap-16 items-center`
- Min-height: `min-h-[calc(100vh-72px)]`

### Mobile (< 1024px) — Hero Section
```
┌───────────────────────────┐
│  Text (compact, stacked)  │
│  H1 prefix (2rem)         │
│  H1 typewriter (2.25rem)  │
│  H2 (1 line)              │
│  Trust badges             │
├───────────────────────────┤
│  Magic Widget             │
│  (full-width card)        │
│  Chips (horizontal scroll) │
│  [Generate CTA — 56px]    │
└───────────────────────────┘
```
- Widget: `w-full rounded-[28px]` (with 16px page padding)
- CTA: `w-full h-14 rounded-full` + `padding-bottom: env(safe-area-inset-bottom)`

### Section Spacing
| Section | Top Padding | Bottom Padding |
|---------|------------|----------------|
| Hero (S1) | `pt-12 sm:pt-14` | `pb-16 sm:pb-20` |
| Social Proof (S2) | `py-10 sm:py-14` | |
| Before/After (S3) | `py-20 sm:py-28` | |
| Brain (S4) | `py-20 sm:py-28` | |
| Video (S5) | `py-20 sm:py-28` | |
| Pricing (S6) | `py-20 sm:py-28 pb-32` | |

---

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| L0 — Void | No decoration | Page background |
| L1 — Aurora | Blurred radial gradients, `z-0` | Background ambient light |
| L2 — Grid | Subtle 64px grid, `z-0`, Dark only | Texture |
| L3 — Surface | Glass card, `z-10`, `backdrop-blur-2xl` | Widget, section cards |
| L4 — Interactive | Raised hover state, extra shadow | Hovered cards, active buttons |
| L5 — Overlay | Paywall panel, Drawer, Dialog | Attention capture |

### Shadow Philosophy
- **Dark Mode**: Inward rings + deep ambient `rgba(0,0,0,0.4)` — dark frames dark
- **Light Mode**: Large-spread soft ambient `rgba(15,23,42,0.10)` — floating paper effect
- **Hover**: Add `0 4px 8px rgba(0,0,0,0.12)` dark shadow (no color tint)
- **No harsh drop shadows**: All shadows use large blur-radius (20px+)

---

## 7. Do's and Don'ts

### Do
- Use `bg-zinc-950` (not `bg-black`) for dark page/section backgrounds
- Use **`zinc`** for ALL neutral colors — never `slate` or `gray`
- Use **`zinc-900` / `zinc-950`** as primary interactive color in Light Mode
- Use **`white` / `zinc-50`** as primary interactive color in Dark Mode
- Keep Aurora limited to atmospheric background — never use blue/cyan as button colors
- Lock all animated containers with explicit `min-h-*` to prevent CLS
- Keep Terminal State color scheme (`zinc-950 + emerald-400`) consistent regardless of page mode
- Ensure section fade masks use **exact same color** as section background (`dark:from-zinc-950`)
- Add `env(safe-area-inset-bottom)` to all bottom-fixed elements

### Don't
- **NEVER use violet / purple / pink / fuchsia** as interactive colors in homepage
- **Don't use `bg-black`** — always `bg-zinc-950` (`#09090B`)
- **Don't mix `slate` / `gray` / `zinc`** — stick to `zinc` exclusively
- Don't use Aurora blob colors (blue/cyan/indigo) as button or text accent colors
- Don't put `backdrop-blur` on more than 3 elements per viewport — GPU intensive
- Don't let Widget change height during state transitions — CLS killer
- Don't use `innerHTML` for streaming text — use reactive refs
- Don't set Aurora blob opacity above `0.60` in Light Mode

---

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile (base) | < 640px | Stack layout, compact H1 (`2rem`), full-width Widget |
| Tablet (sm) | 640px–1023px | Still stacked, larger type, Widget max-w-lg |
| Desktop (lg) | 1024px–1279px | Side-by-side 50/50, H1 `2.25rem`–`3.5rem` |
| Wide (xl+) | ≥ 1280px | H1 `3.5rem`+, generous padding |

### Mobile Specific Rules
1. All touch targets: minimum `44px` height
2. Primary CTA: `h-14` (56px), `rounded-full`, full-width on mobile
3. Keyboard safety: `pb-[env(safe-area-inset-bottom)]` on all bottom-fixed elements
4. Magic Chips: `flex overflow-x-auto gap-2 pb-1 scrollbar-hide`
5. Country Picker: shadcn-vue `Drawer` — never native `<select>`
6. Aurora blobs on mobile: max `85vw`, `blur(60px)` for performance

---

## 9. Agent Prompt Guide

### Quick Color Reference (Tailwind classes)

```
─── Backgrounds ─────────────────────────────────────────────
Dark page base:      bg-zinc-950          (#09090B)
Light page base:     bg-[#F8FAFC]
Dark glass widget:   bg-white/[0.06]      + border-white/[0.09]
Light glass widget:  bg-white/90          + border-zinc-200/80

─── Neutrals (zinc ONLY) ────────────────────────────────────
Strong text L:       text-zinc-950
Body text L:         text-zinc-700
Muted text L:        text-zinc-500
Strong text D:       text-zinc-50
Body text D:         text-zinc-300
Muted text D:        text-zinc-400
Divider L:           border-zinc-200/50
Divider D:           border-zinc-700/50

─── PRIMARY Interactive (Ink) ───────────────────────────────
Button Light:        bg-zinc-900 text-white     hover:bg-zinc-800
Button Dark:         bg-white text-zinc-900     hover:bg-zinc-100
Active tab Light:    bg-zinc-900 text-white
Active tab Dark:     bg-white text-zinc-900
Focus ring:          ring-zinc-500/50
Kicker badge L:      bg-zinc-100 text-zinc-600
Kicker badge D:      bg-white/[0.08] text-zinc-400

─── Aurora blobs (atmosphere ONLY — never use for UI) ───────
Light blob 1:        #BFDBFE (blue-200)    opacity 0.55
Light blob 2:        #A5F3FC (cyan-200)    opacity 0.55
Light blob 3:        #C7D2FE (indigo-200)  opacity 0.40
Dark blob 1:         #3B82F6 (blue-500)    opacity 0.40
Dark blob 2:         #06B6D4 (cyan-500)    opacity 0.40
Dark blob 3:         #6366F1 (indigo-500)  opacity 0.40

─── Terminal state (mode-agnostic) ──────────────────────────
Terminal bg:         bg-zinc-950
Terminal text:       text-emerald-400 font-mono
Terminal dim:        text-emerald-300/60
```

### Component Prompt Templates

**Hero section:**
> "Create a hero section with `min-h-[calc(100vh-72px)]` on `bg-[#F8FAFC] dark:bg-zinc-950`. Left column: kicker badge `text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-white/[0.08]`. H1 with prefix `text-[1.6rem] lg:text-[2.25rem] font-bold text-zinc-900 dark:text-zinc-50` and typewriter `text-[2.25rem] lg:text-[3.5rem] font-extrabold bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-zinc-50 dark:via-zinc-300 dark:to-zinc-500 bg-clip-text text-transparent`. Right column: glassmorphism card `bg-white/90 dark:bg-white/[0.06] border border-zinc-200/80 dark:border-white/[0.09] backdrop-blur-2xl rounded-[28px]`"

**Primary CTA button:**
> "`h-14 w-full rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_32px_rgba(0,0,0,0.25)] transition-all duration-300`"

**Section card:**
> "`rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-400/60 dark:hover:border-zinc-600/50 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer`"

**Section header:**
> "Section label `text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500`, H2 `text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50`, subtitle `text-base sm:text-lg text-zinc-500 dark:text-zinc-400`"

**Terminal generating state:**
> "`bg-zinc-950 rounded-xl p-6 min-h-[320px] font-mono text-sm text-emerald-400 leading-relaxed` with skeleton `animate-pulse text-emerald-300/50` then streaming `<span>` with cursor `after:content-['|'] after:animate-[blink_1s_step-end_infinite]`"

---

## 6. Interaction Response Rules（交互响应规则）

> **核心原则：用户行为必须在 100ms 内得到视觉反馈。** 任何无反馈的延迟都会让用户误以为"没点到"，引发重复点击或离开。

### 6.1 按钮点击即时反馈（Button Immediate Feedback）

**规则**：所有触发异步操作（页面跳转、网络请求、数据处理）的按钮，在用户点击后必须**立即**进入 Loading 状态，直到操作完成。

| 情景 | 正确做法 | 禁止做法 |
|------|----------|----------|
| 点击后跳转页面（`router.push`） | 立即将按钮图标替换为 `lucide:loader-2 animate-spin`，同时 `disabled` 防止重复点击 | 用 `<NuxtLink>` 包裹 `<button>` 但不管理任何 Loading 状态 |
| 点击后调用 API | 在 `await $fetch(...)` 之前设置 `isLoading = true`，完成后 `= false` | 等 API 返回后再更新 UI |
| 列表中某一项触发跳转 | 仅对被点击的那一项显示 Spinner（`loadingId === item.id`），其余项变为 `disabled:opacity-60` | 点击后整个列表消失或整页 Loading |

**实现模板**（适用于跳转类 CTA）：

```vue
<button
  :disabled="isLoading"
  class="... disabled:opacity-70 disabled:cursor-not-allowed"
  @click="handleClick"
>
  <Icon
    :name="isLoading ? 'lucide:loader-2' : 'lucide:arrow-right'"
    :class="['w-4 h-4', isLoading && 'animate-spin']"
  />
  {{ label }}
</button>
```

```ts
const isLoading = ref(false)
const handleClick = async () => {
  if (isLoading.value) return   // 防重复点击
  isLoading.value = true
  await router.push(targetPath)
  isLoading.value = false
}
```

### 6.2 表单提交反馈

- 提交按钮在 `submit` 后立即变为 Loading，直到服务端响应（成功或失败）
- 成功：短暂显示 `lucide:check` 后跳转或重置
- 失败：恢复按钮可点击状态，并显示错误 Toast

### 6.3 禁止使用原生 `<NuxtLink>` 直接包裹需要 Loading 的按钮

`<NuxtLink>` 触发导航时，Vue Router 在后台异步处理路由，无法自动给按钮添加 Loading 状态。  
**正确做法**：改用 `router.push()` + 手动 Loading ref。

---

### Iteration Checklist
1. Always apply `dark:` variants alongside light variants on every color class
2. Verify neutral colors use **`zinc`** — replace any `slate-*` or `gray-*`
3. Verify **no `violet` / `purple` / `pink`** classes exist in homepage components
4. Widget maintains `min-h-[480px]` during ALL three states
5. Section fade masks match section background exactly (`dark:from-zinc-950`)
6. All bottom-fixed CTAs have `env(safe-area-inset-bottom)`
7. All interactive elements ≥ 44px touch target
8. Aurora blob colors are ONLY used in `AuroraBackground.vue` — never in UI components
9. **Every async button shows Loading state on click — no silent 3-5s wait allowed** (see §6)
