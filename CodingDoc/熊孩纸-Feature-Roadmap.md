# 熊孩纸 (BearKid) — 功能路线图归档

> 本文档归档所有未在 Phase 1 实现的功能。按模块整理，标明优先级、技术选型与关联 PRD 章节。
> Phase 1 已交付：工程地基 + 认证流程 + 基础多模态 AI Chat。

---

## 优先级说明
- **P0** — 核心竞争力，影响留存
- **P1** — 显著提升体验，影响转化
- **P2** — 差异化特性，影响口碑
- **P3** — 长期演进，战略布局

---

## 📦 Phase 2：AI 核心能力增强

### 1. OpenClaw AI 配置系统（P0）
**模块描述**：Markdown 文件驱动的 AI 人格与行为配置系统

| 配置文件 | 作用 | 存储位置 |
|---------|------|---------|
| `IDENTITY.md` | AI 老师名字/人设/风格 | Supabase user_profiles.ai_config |
| `SOUL.md` | 教育哲学/价值观/底线 | 租户级配置 |
| `USER.md` | 学生画像（年级/兴趣/薄弱点） | 自动更新 |
| `MEMORY.md` | 短期/长期记忆索引 | pgvector 语义索引 |
| `SKILL.md` | 当前激活的学科技能包 | 动态加载 |
| `AGENTS.md` | 子 Agent 编排（错题/词汇） | Vercel Workflow |
| `BOOTSTRAP.md` | 首轮对话引导脚本 | 启动注入 |
| `HEARTBEAT.md` | 定时任务提示词（做梦/整理） | QStash 触发 |

**技术选型**：pgvector (`vector(1536)`) + OpenRouter Embeddings + Supabase Storage（Markdown 文件）

**关联 PRD**：PRD § AI 配置系统、§ OpenClaw

---

### 2. 错题本三归因引擎（P0）
**模块描述**：将错误分类为「粗心 / 理解偏差 / 概念空白」，针对性强化

| 归因类型 | 判断逻辑 | 干预策略 |
|---------|---------|---------|
| Careless（粗心） | 同类题正确率 > 80% 但本题错 | 提醒检查步骤 |
| Comprehension（理解偏差） | 答题逻辑偏题 | Socratic 追问 |
| Conceptual Gap（概念空白） | 完全无思路 | Feynman 补课 |

**技术选型**：LLM 分类 + Supabase `error_records` 表 + FSRS 调度

**关联 PRD**：PRD § 错题本、§ 归因引擎

---

### 3. pgvector 双轨记忆存储（P1）
**模块描述**：短期 episodic + 长期 semantic 双轨记忆，支持个性化上下文注入

```sql
-- 预规划表结构
create table memory_vectors (
  id uuid primary key,
  profile_id uuid references user_profiles(id),
  content text,
  embedding vector(1536),
  memory_type text check (memory_type in ('episodic', 'semantic')),
  importance float default 0.5,
  last_accessed timestamptz,
  created_at timestamptz default now()
);
create index on memory_vectors using ivfflat (embedding vector_cosine_ops);
```

**关联 PRD**：PRD § 记忆系统

---

## 📚 Phase 2：背单词系统（FSRS）

### 4. FSRS 记忆曲线调度器（P0）
**模块描述**：基于 Free Spaced Repetition Scheduler 算法，科学调度词汇复习

**核心参数**：
- `stability`（记忆稳定性）
- `difficulty`（卡片难度）
- `elapsed_days`（距上次复习天数）
- `scheduled_days`（下次间隔）
- `state`：New / Learning / Review / Relearning

**词库三来源**：
1. 教材同步词库（人教版/北师大版，按年级 + 学期）
2. 考试高频词（四六级、中考、高考词表）
3. 错误对话自动提取（LLM 从聊天中识别生词）

**ASR 发音评估**：集成火山引擎 / Google Speech，实时给分

**技术选型**：`ts-fsrs` 库 + Supabase `vocab_cards` 表 + QStash 定时提醒

**关联 PRD**：PRD § 背单词、§ FSRS

---

### 5. 多学科期末复习引擎（P1）
**模块描述**：考前 4 周智能调度，覆盖数学/语文/英语/科学/历史

**调度逻辑**：
- 考前 4 周：全科扫盲，识别薄弱章节
- 考前 2 周：高频错题强化 + FSRS 复习
- 考前 1 周：模拟题 + 心理辅导
- 考前 3 天：轻度复盘，保持状态

**技术选型**：Vercel Cron + QStash + Supabase `review_schedules` 表

**关联 PRD**：PRD § 期末复习、§ 多学科调度

---

## 🎙 Phase 3：实时语音通话

### 6. 实时语音通话（火山引擎/豆包）（P1）
**模块描述**：国内低延迟实时语音 AI 对话，模拟真人教师通话

**技术选型**（PRD 补充需求 6）：
- **STT**：火山引擎 ASR（毫秒级，中文优化）
- **TTS**：豆包 TTS（自然音色，教师风格）
- **VAD**：本地 Silero VAD（WebAssembly，无需服务端）
- **传输**：WebRTC（p2p） → 降级 WebSocket（NAT 穿透失败）
- **延迟目标**：端到端 < 800ms（国内）

**实现架构**（参考 `CodingDoc/ai-chat-call_ARCHITECTURE.md`）：
- 本地模式：WebRTC + 火山 STT → OpenRouter LLM → 豆包 TTS
- 云端 Sandbox 模式：Vercel Sandbox 托管语音处理

**关联 PRD**：PRD § 实时语音、补充需求 § 火山引擎

---

### 7. 做梦/夜间整理（QStash 后台任务）（P2）
**模块描述**：每晚凌晨 AI 整理当日学习内容，生成记忆巩固摘要

**执行流程**：
1. QStash Cron → `/api/jobs/nightly-digest`
2. 查询当日 chat_messages
3. LLM 提炼知识点 + 情绪词
4. 更新 MEMORY.md + 触发次日 FSRS 调度

**技术选型**：QStash（参考 `CodingDoc/QStash_Background_Jobs_Architecture.md`）+ Vercel Edge Function

**关联 PRD**：PRD § 做梦整理、§ HEARTBEAT

---

## 👨‍👩‍👧 Phase 3：家长功能

### 8. 家长配置面板（P1）
**模块描述**：家长通过 UI 调整 AI 老师的个性和教育风格

**功能点**：
- SOUL.md 提示词滑块（严格 ↔ 温柔、启发 ↔ 直接）
- 禁止话题设置（不讨论游戏/娱乐）
- 每日使用时限
- 学科侧重配置

**关联 PRD**：PRD § 家长配置、§ SOUL

---

### 9. 成长报表（P1）
**模块描述**：周/月维度的学习数据可视化报告

**数据维度**：
- 对话次数/时长趋势
- 知识点掌握雷达图
- 错题归因分布饼图
- FSRS 词汇记忆曲线
- 情绪/积极性指标

**技术选型**：Nuxt + ECharts/Chart.js + Supabase Analytics 视图

**关联 PRD**：PRD § 成长报表

---

## 🔐 Phase 3：身份与授权

### 10. 微信登录（P2）
**模块描述**：微信扫码/小程序登录，降低注册门槛

**技术选型**：微信开放平台 OAuth2 → Supabase Custom Auth Provider

**依赖**：微信开放平台认证（需营业执照）

**关联 PRD**：PRD § 微信登录

---

### 11. 孩子扫码授权（P1）
**模块描述**：孩子用设备扫描家长手机上的二维码完成无密码登录

**技术选型**：Supabase Realtime channel（`scan-auth-{token}`）+ QR 码生成

**关联 PRD**：PRD § 扫码授权

---

## 🎨 Phase 4：多模态输出增强

### 12. HTML 知识卡片输出（P2）
**模块描述**：AI 生成可交互的 HTML 知识卡片（支持动画、图表）

**技术选型**：Vercel Sandbox 执行 HTML + iframe 安全沙箱

**关联 PRD**：PRD § 多模态输出 § HTML Cards

---

### 13. Remotion 动画讲解视频（P3）
**模块描述**：AI 生成程序化动画视频，用于数学/科学可视化讲解

**技术选型**：Remotion + Vercel Function（视频渲染）

**关联 PRD**：PRD § 多模态输出 § Remotion

---

### 14. 外部视频推荐内嵌播放（P2）
**模块描述**：根据学习话题推荐 YouTube/B站 教育视频，内嵌播放

**技术选型**：YouTube Data API v3 / B站开放 API + 关键词搜索

**关联 PRD**：PRD § 视频推荐

---

## 📊 Phase 4：知识库与认知标注

### 15. 试题库认知标注系统（P2）
**模块描述**：基于 Bloom 分类法标注题目认知层次，驱动差异化出题

**认知层次**：记忆 → 理解 → 应用 → 分析 → 评价 → 创造

**技术选型**：LLM 自动标注 + 人工审核界面 + Supabase `questions` 表

**关联 PRD**：PRD § 题库 § 认知标注

---

### 16. 官方大纲知识库（P1）
**模块描述**：内置各学科官方课程标准知识点体系，用于知识对齐

**数据来源**：教育部课程标准（2022版）、各省地方标准

**技术选型**：pgvector 向量化 + 知识图谱（PostgreSQL JSON）

**关联 PRD**：PRD § 知识标准 § 课程大纲

---

## 📋 技术债务与优化

| 项目 | 说明 | 优先级 |
|-----|-----|-------|
| 服务端 PIN 哈希 | 目前明文传 DB，应改为应用层 bcrypt | P0（安全） |
| Chat 消息持久化 | 目前仅内存，需写入 `chat_messages` 表 | P0 |
| Chat Session 管理 | 会话列表、历史加载 | P1 |
| 音频 STT 转文字 | 目前语音只上传，未转文字 | P1 |
| Supabase Storage Bucket | 需手动在 Supabase 控制台创建 `bearkid-media` bucket | P0（部署） |
| Rate Limiting | API 限流防滥用 | P1 |
| Error Monitoring | Sentry 接入 | P1 |
| 端到端测试 | Playwright E2E | P2 |

---

## 🚀 版本规划

| 版本 | 目标 | 预计周期 |
|-----|-----|-------|
| **v0.1** (Phase 1) ✅ | 地基 + 认证 + 基础 Chat | 已完成 |
| **v0.2** (Phase 2) | OpenClaw + 错题本 + FSRS | 6-8 周 |
| **v0.3** (Phase 3) | 实时语音 + 家长面板 + 报表 | 8-10 周 |
| **v1.0** (Phase 4) | 多模态输出 + 知识库 + 微信登录 | 12-16 周 |
