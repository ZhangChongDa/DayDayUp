## 设计原则：

1. 设计哲学: 引用 Google Material Design 3，强调直觉、无错位感（如NotebookLM的左侧来源、中心聊天、右侧生成）。
2. 用户在使用本系统过程中的交互需要满足下述三个原则，

**目标：让用户零阻力到达AI功能起点**

### 1. 别让我猜 → **路径必须清晰**

- **价值前置**：3秒内让用户明白产品核心AI功能是什么、在哪里
- **导航直观**：主导航遵循行业惯例（如对话历史在左侧，输入框在底部）
- **预设功能明确**：非提示词功能（如"一键总结"）的按钮名称必须准确预示结果

### 2. 别让我等 → **响应必须敏捷**

- **性能优先**：页面加载、跳转、非AI操作响应时间<100ms
- **预加载准备**：用户可能使用的AI模块资源应提前静默加载
- **即时反馈**：所有操作（点击、切换）都有视觉反馈（按钮态、过渡动画）

### 3. 别让我烦 → **流程必须简洁**

- **极简前置**：注册/登录流程最简化（支持第三方一键登录）
- **克制引导**：新手引导只展示关键信息，不超过3步
- **智能默认**：AI功能参数预设合理值，新手无需配置即可使用
- **减少干扰**：核心任务路径上不弹营销广告或强制评分

1. 用户在与本系统的AI进行=交互（用户如何与AI对话协作）的三个原则

**目标：让对话自然、高效、有成就感**

### 1. 别让我猜 → **AI行为必须透明**

- **输入引导**：输入框提供明确占位符/示例/模板
- **能力边界**：清晰告知AI擅长什么、不擅长什么
- **过程可视化**：复杂任务时显示"思考步骤"（如"分析中..."）
- **输出结构化**：回复使用标题、列表、加粗，关键信息优先

### 2. 别让我等 → **AI响应必须流畅**

- **黄金准则**：**始终采用流式输出**（逐词/句显示），绝对不要等全文生成完再一次性显示
- **速度优先**：默认模式保障速度，可选"深度思考"模式换取质量
- **长任务管理**：生成图片/长文时提供进度条或预计时间，允许后台处理

### 3. 别让我烦 → **AI交互必须克制**

- **专注主线**：只解决当前问题，不主动引入无关话题
- **建议适时**：只在用户需要时（输入框空置、对话结束）提供少量精准建议
- **承认未知**：不会时说"不清楚"，并提供替代方案（如"我可帮您搜索..."）
- **用户控制**：提供"停止生成"、"重新生成"、"编辑提问"等明确控制项

1. ⚡ 快速检查清单（设计/评审时自问）

### 系统层面：

- 新用户能否3秒内找到核心AI功能？
- 主要页面加载是否够快（<1秒）？
- 注册到首次使用AI是否不超过3步？
- 界面是否干净，无无关干扰？

### AI交互层面：

- AI回复是否采用流式输出？
- 输入框是否有清晰示例引导？
- 用户能否随时停止AI生成？
- AI是否避免主动跑题或过度建议？

**核心哲学**：系统是舞台（稳固通畅），AI是主演（流畅聪明），二者配合才能演出好体验。

> 将此原则融入每个设计决策、代码实现和产品评审中。

1. 融合EazzyAI小清新风格：自然流动布局、舒适间距（extensive whitespace）、科技生命力（微妙渐变、呼吸动画）。
2. **首页视觉规范**：首页（`pages/index.vue` 及所有 `components/home/`* 组件）必须严格遵守 `design/homepage/DESIGN_AURORA.md` 设计规范。
  - 主色调为 **黑/Zinc**（`zinc-900`/`zinc-950`），不使用 violet / purple 作为主交互色
  - Aurora 光晕颜色：蓝（`#BFDBFE`）× 青（`#A5F3FC`）× 靛（`#C7D2FE`），Dark Mode 对应饱和版本
  - 中性色系统一使用 **zinc**，禁止混用 slate / gray
  - 详细规范见 `design/homepage/DESIGN_AURORA.md`
  - **首页性能规范**：见 **RULE 33**；技术细节与 Lesson Learned 见 `codingNotes/Coding-TechDoc/HomePage-newfeature.md` §10–11
3. 应用下述三种色彩作为产品内页（非首页）的品牌辅助色调，Logo为黑白配色，痞帅，扁平风格：
  #1276cf
   #00abec
   #0de3ec

## 任务执行要求：

1. 对于问题分析类型的任务(包括但不限于代码编译错误，页面功能错误，交互样式不好等)，请遵循下述步骤

- 请深入并持续分析当前问题直到找到造成问题的根本原因，
- 请基于问题的根本原因推理并分析解决该问题的最佳解决方案，注意不是WorkAround，最佳解决方案的标准是小改动但直接解决问题，且不造成其他的负面问题

1. 如果是需求开发类型的任务，请遵循下述步骤

- 请基于用户的输入全面推理和理解出用户的开发任务的核心意图，
- 基于用户开发意图的识别，进行互联网和知识库的最佳实践的匹配，
- 罗列出经过你过滤后最为符合用户需求预期，同时能够全面达成用户意图的解决方案，并征得用户的确认
- 在获得用户确认后，基于 ** 设计原则 ** 进行实际的
 例如：用户说在当前页面中创建一个下拉列表，
 深入分析当前用户的需求，
直到全面理解需求并找到最佳开发方案

1. 请采用简单易懂的语言介绍你的分析和方案，
2. 请在获得我的认可后再进行实际的代码修正
3. 请采用简单易懂的代码撰写方式，并需要高效且可商用的标准
4. 请充分反思你分析的解决方案，一直到你认为找到了最佳的解决方案方案为止。
5. 在实际生成代码后，请进行2次到3次的代码评审，直到你认为最终的代码已经能够达到简单易懂，高效安全，且可以满足SaaS系统的商用标准。
6. 请支持多语言版本，完成中文 zh.json 和 英文 en.json部分的多语言标签，
7. 请支持dark mode 和 light mode，
8. 请采用tailwindcss的css样式, 请采用shadcn-vue的vue组件
9. 页面跳转类型，需要采用 下述 Loading 加载动画，

- @components/ui/news-loader/NewsLoader.vue

1. 事件处理按钮，需要采用下述的 Processing动画

- @components/ui/flow-button/FlowButton.vue

1. 调用 shadcn MCP工具，浏览，选择，添加适合本系统的，来自于React Bits动态效果
2. Nuxt3多层级组件的架构需要采用-通过slot进行传递
3. 永远不要让让AI直接处理长URL，他存在极高的可能行去篡改，而是给AI一个简短的ID
4. AI架构的代码更新请更新到 BrandNote_Complete_Architecture.md，对于前端的样式修改，Bug修改不要进行文档的更新，否则文档就太大了。同时，新的功能的开发不需要，如果不涉及AI的架构变化不需要进创建文档。
5. **i18n 末尾追加原则（P0 优先级）** 🚨
  - 新增多语言标签时，**必须追加到对应语言文件（`en.json`、`zh.json`）的最末尾**，不允许在文件中间插入
  - 这样方便后续新增语言版本时，翻译人员只需处理末尾的新内容，不会破坏现有翻译结构
  - 错误示例：在 `landing.proof` 对象中间插入新 key
  - 正确示例：在文件末尾新增 `"landing": { "newSection": { "key": "value" } }`
  - 除非是修正已有功能的文案，不得插入现有 JSON 对象内部
6. **Web 端与移动端双端支持原则（P0 优先级）** 🚨
  - 所有新开发的页面和组件**必须同时支持 Web 端（1024px+）和移动端（< 640px）**
  - 移动端使用 Tailwind 默认（无前缀）样式作为 base，Web 端使用 `sm:` / `lg:` 前缀覆盖
  - 强制要求：
  1. 触控目标最小 44px 高度（`h-11` 或 `min-h-[44px]`）
  2. 主要 CTA 按钮高度 56px（`h-14`），且为 `rounded-full`
  3. 移动端底部固定元素必须包含 `pb-[env(safe-area-inset-bottom)]`
  4. 横向滚动元素使用 `overflow-x-auto scrollbar-hide`
  5. 图片使用 `NuxtImg` 配合 `loading="lazy"` 和 `placeholder`
    要求：每次 UI 改动后，分别在移动端（375px）和桌面端（1440px）下视觉验证
7. **JSON i18n 文件中严禁使用中文标点符号**

- **问题**: JSON 字符串值中使用中文引号（`"文本"`）会导致 JSON 解析错误
- **错误示例**: `"noAudiences": "请前往"受众洞察"标签"`  
解析器会在第一个 `"` 处认为字符串结束，导致 `SyntaxError: Unexpected token`
- **正确方案**:
  - 方案1: 使用【】符号强调: `"请前往【受众洞察】标签"` ✅ 推荐
  - 方案2: 使用转义的英文引号: `"请前往\"受众洞察\"标签"` ✅ 可用但不够优雅
  - 方案3: 去掉引号: `"请前往受众洞察标签"` ✅ 最简洁
- **检查命令**: 使用 `grep -n ': ".*".*".*"' i18n/locales/*.json` 快速检查所有可疑位置
- **适用范围**: 所有 JSON 文件（i18n、配置文件等）

1. **分步测试原则（P0 优先级）** 🚨

- **问题**: 一次性开发多个功能后才测试，导致问题叠加，难以定位根因
- **强制要求**:
  1. 每完成 1-2 个功能，必须立即测试
  2. 分阶段提交代码（不要积累过多修改）
  3. 在开发新功能前，先测试依赖的后端 API
  4. 关键路径必须端到端测试（如品牌初始化流程）
  5. 运行时错误检测（浏览器 Console + Server Log）
- **检查清单**:
  - 每个 Phase 完成后立即测试
  - 依赖系统健康检查
  - 关键路径端到端测试
  - 分阶段 Commit

1. **数据库 Schema 必读原则（P0 优先级）** 🚨

- **问题**: 直接使用错误的字段名（如 `metadata` vs `locationMetadata`），导致查询失败
- **强制要求**:
  1. 在编写数据库查询前，必须先阅读 Schema：`grep -A 20 "model XXX" prisma/schema.prisma`
  2. 使用 Prisma Studio 验证字段：`npx prisma studio`
  3. 字段名不确定时，先搜索现有代码的正确用法
  4. 避免字段名混淆（如 `NoteSource.metadata` ≠ `SourceSegment.locationMetadata`）
- **检查清单**:
  - 阅读了 Schema 模型定义
  - 确认字段名拼写正确
  - 参考了现有代码
  - 使用 TypeScript 类型检查

1. **API 返回类型必须明确（P1 优先级）** 🚨

- **问题**: `loadSourceContent` 返回 `{ content, metadata }`，但被当作字符串使用
- **强制要求**:
  1. 所有函数必须有明确的返回类型注解
  2. 调用 API 前，先查看函数定义（Cmd + Click 跳转）
  3. 正确访问返回对象的属性（避免 `result.length`，应该是 `result.content.length`）
  4. 避免 `any` 类型（使用具体类型）
- **示例**:
  ```typescript
  // ❌ 错误
  const result = await loadSourceContent(source);
  if (result && result.length > 100) { }

  // ✅ 正确
  const result = await loadSourceContent(source);
  if (result && result.content && result.content.length > 100) { }
  ```

1. **变量重命名时的全局替换（P0 优先级）** 🚨

- **问题**: 参数从 `language` 改为 `originalLanguage`，但模板字符串中的 `${language}` 没有更新
- **强制要求**:
  1. 使用 IDE 的全局重命名功能（F2 键）
  2. 手动重命名后，必须全局搜索：`grep -rn '\${oldName}' .`
  3. 特别注意模板字符串中的变量
  4. 保持变量名统一性（避免 `originalLanguage` → `lang` → `language` 的多次转换）
- **检查清单**:
  - 使用 IDE 自动重命名
  - 全局搜索旧变量名
  - 特别检查模板字符串
  - 测试重命名后的代码

1. **多语言场景的明确处理（P2 优先级）**

- **问题**: 假设所有内容是单一语言，但实际可能是多语言混合（如缅甸语 + 泰语 + 英文）
- **处理策略**:
  1. 按 Source 分别检测语言
  2. 定义主语言选择规则（优先级：targetMarket > 最多内容的语言 > 默认英文）
  3. 提供多语言混合的处理策略（分别分析 or 全部翻译）
  4. 记录语言分布统计
- **检查清单**:
  - 考虑了多语言场景
  - 定义了主语言选择规则
  - 提供了处理策略
  - 记录了语言分布

1. 下述 schema.primsa 中定义的数据表属于历史功能，会逐步淘汰，因此如果你希望修改或者新建数据表的时候不要考虑下述即将drop掉的数据表

- model FbPostGenData
- model AiTask
- model MarketingPlanReq
- model FacebookPagePost
- model MarketingPlan
- model CompetitorFB
- model TargetAudienceFB
- model FacebookPage
- model Product
- model Brand 
- model Company
- model UserSubscription 
- model ApiCall 
- model UserApiLimit

---

## Rule 25 (原 24): 问题清单对照验证原则 🔥🔥🔥

**问题来源**: Phase1 第二轮修复失败 - 未对照原始问题导致遗漏  
**核心原则**: 每完成一个问题的修复后，必须执行 4 步验证流程，避免遗漏和幻觉

**实施要点**:

1. **读取原始问题描述**
  - 回到用户的原始反馈（不是自己的分析文档）
  - 逐字阅读问题描述
  - 标注问题的每个细节要求（如"48 张图片"、"favicon URL"）
2. **搜索相关代码确认修改**
  - 不能假设修改生效，必须用 Grep/Read 确认代码已变更
  - 必须检查调用路径完整（import → 调用 → 返回值使用）
  - 搜索关键变量/函数，确认语法正确
3. **对照问题的每个细节**
  - 不能只看问题标题（如"修复 Puppeteer"）
  - 必须检查每个子项（如"本地环境"、"Vercel 环境"、"错误处理"）
  - 必须确认所有细节都被处理（不能遗漏）
4. **标记为 completed 前二次确认**
  - 重新读取问题描述
  - 确认无遗漏
  - 如有不确定，先标记为 pending 而不是 completed

**反面案例**:

```typescript
❌ 错误方式：
- 修改了 Puppeteer 代码 
  → 立即标记"已完成" 
  → 没有启动测试
  → 结果：本地环境依然报错

✅ 正确方式：
- 修改了 Puppeteer 代码 
  → 重新读取问题描述（"Puppeteer 报错 executablePath"）
  → 搜索验证代码已变更（isVercel, isDev 存在）
  → 对照细节（本地环境、Vercel 环境、错误处理都完成）
  → 启动服务器测试（可选但推荐）
  → 查看日志确认无错误
  → 标记"已完成"
```

---

## Rule 26 (原 25): 用户日志证据优先原则 🔥🔥🔥

**问题来源**: Phase1 第二轮修复失败 - 否定用户日志证据导致幻觉  
**核心原则**: 如果用户提供了日志、截图、数据库记录等证据，永远相信证据 > 假设

**实施要点**:

1. **证据 > 假设**
  - 永远不要否定用户提供的证据
  - 如果代码搜索未找到，不代表不存在
  - 必须换关键词继续搜索（至少 3 种搜索方式）
2. **日志溯源法**
  - 从日志输出倒推代码位置
  - 搜索日志中的关键字符串（如 "Step 1: Deepseek v3"）
  - 搜索日志打印语句（如 `console.log('Step')`）
  - 搜索模型名称（如 "deepseek-chat", "deepseek-v3"）
3. **多角度搜索**
  - 第 1 次搜索：函数名（如 `generateSourceGuide`）
  - 第 2 次搜索：模型名（如 `deepseek-chat`）
  - 第 3 次搜索：日志字符串（如 `解析品牌手册`）
  - 第 4 次搜索：配置参数（如 `modelName.*deepseek`）
  - 如果都未找到，搜索文件名（如 `ingestion.ts`）
4. **承认不确定性**
  - 如果找不到，说"我暂时未定位到，需要进一步搜索"
  - 不要说"未发现"或"不存在"或"架构已优化"
  - 请求用户提供更多日志或上下文

**反面案例**:

```typescript
❌ 错误方式：
用户：日志显示 "Step 1-7: Deepseek v3 解析品牌手册"
我：搜索 "deepseek-v3" → 未找到 
   → 回复"代码中未发现 V3 预处理，架构已优化"
结果：用户不满意，因为日志明确显示有 V3 调用

✅ 正确方式：
用户：日志显示 "Step 1-7: Deepseek v3 解析品牌手册"
我：第 1 次搜索 "deepseek-v3" → 未找到
   → 第 2 次搜索 "deepseek-chat" → 找到了！在 ingestion.ts
   → 第 3 次搜索 "解析品牌手册" → 未找到
   → 第 4 次搜索 "generateSourceGuide" → 确认是这个函数
   → 回复"找到了！在 ingestion.ts 第 27 行的 generateSourceGuide 函数，使用 deepseek-chat 模型"
结果：用户满意，问题定位准确
```

---

## Rule 27 (原 26): 工具创建必须伴随集成验证 🔥🔥🔥

**问题来源**: Phase1 第二轮修复失败 - 创建工具但未集成到调用流程  
**核心原则**: 创建新工具/函数/文件后，必须完成 3 步集成，避免"半成品"

**实施要点**:

1. **步骤 1: 创建工具** - 实现核心功能
2. **步骤 2: 集成到调用流程** - 在实际业务逻辑中调用
3. **步骤 3: 验证调用路径** - 确认调用链完整

**具体检查项**:

```
□ 工具/函数是否被 import（搜索 `import.*toolName`）
□ 工具/函数是否被调用（搜索 `toolName\(`）
□ 调用参数是否正确（对照函数签名）
□ 返回值是否被使用（赋值给变量 or 传递给其他函数）
□ 错误处理是否完整（try-catch, 不中断主流程）
```

**反面案例**:

```typescript
❌ 错误方式：
1. 创建 facebook-sampler.ts
   - export function sampleFacebookPosts(...)
   - export function formatPostsForAI(...)
2. 标记"P2-3 已完成"
3. 结束
结果：工具创建了但从未被调用，相当于无用代码

✅ 正确方式：
1. 创建 facebook-sampler.ts
   - export function sampleFacebookPosts(...)
2. 在 orchestrator.ts 中导入
   - import { sampleFacebookPosts, formatPostsForAI } from './facebook-sampler'
3. 在 Phase 1 调用
   - const fbResult = await sampleFacebookPosts(url, 5)
   - const fbContent = formatPostsForAI(fbResult.posts)
4. 使用返回值
   - combinedContent += fbContent
5. 搜索验证调用路径
   - grep 'sampleFacebookPosts' orchestrator.ts → 找到调用
6. 标记"P2-3 已完成"
结果：工具创建、集成、验证全部完成
```

**强制检查**:

- 创建工具后 24 小时内必须集成
- 标记 completed 前必须搜索调用处
- 如果工具未被使用，删除而不是保留

## 复杂问题的解决方案 Lesson Learn

1. i18n上下文传递

当组件通过slot从BrandNotesWorkspace传递到AIChatPanel时，i18n上下文丢失了！这是Vue 3 + Nuxt 3中的已知问题。
问题确认：ChatHistoryManagerComplete.vue中没有导入i18n，但模板中使用了$t()函数！
修复方案1：添加i18n导入

## RULE 28: Context Variable Integrity (变量完整性原则)

在重构长链条异步函数（如 Orchestrator）时，必须检查每一个在 switch-case 或 loop 中使用的外部变量（如 refreshedSources）是否在当前作用域内可用。
严禁在未传递参数的情况下引用父级作用域的动态变量。

## RULE 28: Silent Sensor Fallback (传感器沉默降级)

语言检测、CSS 探测、FB 抓取等"传感器"工具必须包含全局 try-catch。
若传感器失败，必须返回预定义的 default_value（如 'en' 或空对象），绝不允许抛出异常中断主推理链。

---

## RULE 29: 参数来源验证原则 (P0 优先级) 🔥🔥🔥

**问题来源**: Offering Intake 开发 - 查询不存在的数据库字段 `targetMarket`  
**核心原则**: 在使用任何参数前，必须明确其来源并验证其存在性

**实施要点**:

1. **明确参数来源**
  - 数据库字段 → 必须在 Schema 中存在
  - 请求参数 → 从 `readBody(event)` 或 `readMultipartFormData(event)` 获取
  - 环境变量 → 从 `useRuntimeConfig()` 或 `process.env` 获取
  - 函数参数 → 从函数签名中获取
2. **字段存在性验证清单**
  ```
   □ 是否在 Schema 中搜索了该字段？
      → grep -A 20 "model XXX" prisma/schema.prisma
   □ 是否验证了字段的类型和可选性？
      → 确认 String vs String? vs String[]
   □ 是否检查了类似代码的正确用法？
      → grep -rn "fieldName" server/
   □ 参数来源是否明确？
      → 数据库 / 请求体 / 环境变量 / 函数参数
  ```
3. **避免"参照错误"陷阱**
  - 不要假设其他代码的参数来源与你的相同
  - 例如: `brand-analysis.post.ts` 的 `targetMarket` 来自请求体，不代表它在数据库中存在
  - 必须追溯参数的真实来源，而非仅看到其他地方使用就假设可用
4. **强制搜索流程** (在编写任何 Prisma 查询前)
  ```bash
   # Step 1: 查看模型定义
   grep -A 30 "model BrandNoteWorkspace" prisma/schema.prisma

   # Step 2: 搜索字段是否存在
   grep "targetMarket" prisma/schema.prisma

   # Step 3: 如果不存在，搜索现有代码的正确用法
   grep -rn "targetMarket" server/

   # Step 4: 确认参数来源
   # 查看其他文件如何获取该参数
  ```
5. **使用 Prisma Studio 辅助验证**
  ```bash
   npx prisma studio
   # 在浏览器中查看表结构，确认字段存在
  ```

**反面案例**:

```typescript
❌ 错误方式:
看到其他代码使用 targetMarket 
→ 假设它存在于数据库中
→ 直接查询 workspace.targetMarket
→ 运行时报错: "Unknown field targetMarket"

✅ 正确方式:
看到其他代码使用 targetMarket 
→ 搜索它的来源: grep -rn "targetMarket" server/
→ 发现它来自请求体: const { targetMarket } = await readBody(event)
→ 在 Schema 中搜索: grep "targetMarket" prisma/schema.prisma
→ 发现不存在，决定设为 undefined 或从请求体获取
```

**实际错误示例** (v6.1 修复):

```typescript
// ❌ 错误: 查询不存在的字段
const workspace = await prisma.brandNoteWorkspace.findUnique({
  where: { id: workspaceId },
  select: { targetMarket: true }  // 🚨 targetMarket 不存在于 Schema
})

// ✅ 正确: 移除错误查询，使用可选值
const analysisJob = await prisma.jobQueue.create({
  data: {
    payload: {
      targetMarket: undefined,  // 让AI自动推断
      // ... 其他字段
    }
  }
})
```

**检查清单**:

- 阅读了 Schema 模型定义
- 搜索确认字段在 Schema 中存在
- 参考了现有代码的正确用法
- 明确了参数来源 (数据库/请求体/环境变量/函数参数)
- 使用 TypeScript 类型检查 (注意 select 动态查询可能绕过检查)

---

## RULE 30: 前端组件集成双向追踪原则 (P0 优先级) 🔥🔥🔥

**问题来源**: 视频生成交互优化开发 — 创建了 5 个新组件但未验证父组件是否正确引用，导致运行时 `Failed to resolve component` 错误

**根本原因分析**:

- ❌ 只检查了「新建的组件文件本身」是否正确（单向检查）
- ❌ 没有检查「使用这些组件的父组件」是否有完整的 import 声明（漏掉集成验证）
- ❌ 没有检查新组件所使用的 i18n key 是否已添加到语言文件

**核心原则**: 新建组件后，必须完成「双向追踪验证」：

- **正向**: 组件文件 → 确认文件结构正确、props/emits 定义完整
- **反向**: 使用方父组件 → 确认 import 声明存在、template 引用名称一致、i18n key 完整

---

**强制执行的 3 步集成检查流程**:

### 步骤 1：创建新组件后，立即搜索所有使用方

```bash
# 搜索模板中使用了该组件名的文件
grep -rn "VideoPromptEditor\|VideoMediaPicker" components/
```

### 步骤 2：在每个使用方文件中，确认 3 项

```
□ script 区域是否有显式 import 语句？
  → 特别注意：如果文件已有其他显式 import，则新组件也必须显式 import
  → Nuxt 3 自动注册 在混合了显式 import 的文件中可能不稳定

□ template 中使用的组件名 是否与文件名/导出名完全一致？（大小写敏感）
  → 文件: VideoPromptEditor.vue → 引用: <VideoPromptEditor /> ✅
  → 文件: VideoPromptEditor.vue → 引用: <video-prompt-editor /> ⚠️ 需验证

□ i18n key 是否已添加到 en.json 和 zh.json？
  → 搜索组件中所有 t('xxx') 调用
  → 确认 en.json/zh.json 中已存在对应 key
```

### 步骤 3：代码审计时，必须对「集成点」做完整读取

```
❌ 错误方式：只读取新建的 X 个组件文件，认为"文件存在即正确"
✅ 正确方式：还必须读取父组件（使用方）的 script 区域，确认 import 完整
```

---

**特别注意：Nuxt 3 组件自动注册的陷阱**:


| 场景                                                             | 自动注册是否生效                 |
| -------------------------------------------------------------- | ------------------------ |
| 纯 Nuxt 项目，无任何显式 import                                         | ✅ 自动注册生效                 |
| 文件中有 `import { Button } from '@/components/ui/...'` 等显式 import | ⚠️ 可能不稳定，需显式 import 新组件  |
| 开发服务器未重启（新文件创建后）                                               | ❌ 可能未检测到新文件，需重启          |
| 组件文件在 components/ 子目录                                          | ✅ 理论有效，但建议显式 import 保证稳定 |


**规则**：当目标父文件已有任何显式组件 import 时，新增的子组件**必须也显式 import**，不依赖自动注册。

---

**反面案例（本次失误）**:

```typescript
❌ 错误方式（本次的真实错误）：
// VideoStudioDialog.vue 已有显式 import 区域
import { Dialog, Button, ... } from '@/components/ui/...'   // ← 有显式 import

// 新创建了 5 个组件文件：
// components/brand-notes/VideoPromptEditor.vue
// components/brand-notes/VideoMediaPicker.vue
// ...

// 审计时只检查了组件文件本身，没有检查 VideoStudioDialog.vue 的 script 区域
// 结果：5 个组件在 template 里被使用但 script 里没有 import
// 运行时报错：[Vue warn]: Failed to resolve component: VideoPromptEditor

✅ 正确方式：
// 创建新组件后，立即在父组件添加显式 import
import VideoPromptEditor from './VideoPromptEditor.vue'
import VideoMediaPicker from './VideoMediaPicker.vue'
import VideoReferencePanel from './VideoReferencePanel.vue'
import VideoStyleGallery from './VideoStyleGallery.vue'
import VideoSceneList from './VideoSceneList.vue'
```

**检查清单**:

- 搜索了所有使用该新组件的父组件
- 确认父组件 script 中有显式 import（当父组件已有其他显式 import 时）
- 确认 template 中的组件名与 import 名一致
- 确认新组件用到的所有 i18n key 已添加到 en.json 和 zh.json
- JSON i18n 文件中无重复 key（重复 key 会导致解析异常）

---

## RULE 31: 状态作用域必须匹配决策粒度原则 (P0 优先级) 🔥🔥🔥

**问题来源**: `GeneratedAssetCard.isPartiallyComplete` — 多次修复均失败的顽固 Bug  
**核心原则**: 用于做判断的状态/缓存数据，其作用域（Key 的粒度）必须与被判断实体的粒度严格一致。

---

### 根本原因：跨实体状态污染（Cross-entity State Contamination）

本次 Bug 的本质是：

```
localStorage key: eazzy_draft_scenes_${workspaceId}   ← workspace 级别（1个 workspace 只有1条记录）
决策对象:         某个具体的 GeneratedAsset            ← asset 级别（1个 workspace 有 N 个资产）
```

**当同一个 workspace 里生成了第2个视频（8场景）时：**

- localStorage draft 被覆盖为 8 条 scene
- 旧的已完成的 5 场景视频：`draftLen(8) > sortedScenes(5)` → 错误判定为"未完成"

**为什么多次修复都没找到？**

每次修复都在处理"现象"（Dialog 状态错误、API 数据错误），而没有追溯到 `isPartiallyComplete` 判断逻辑本身的设计缺陷。Bug 在简单场景（workspace 内只有一个视频）无法复现，只有存在多个视频资产时才触发，导致难以定位。

---

### 实施要点

**1. 粒度匹配原则（强制）**

在使用任何缓存/共享状态来判断个体实体的属性时，必须问自己：

```
这个 key/缓存 的粒度 是否与 我要判断的实体 粒度完全一致？

workspace 级别的 key → 只能用于判断 workspace 级别的属性
asset 级别的 key     → 才能用于判断 asset 级别的属性
user 级别的 key      → 只能用于判断 user 级别的属性
```

**2. 优先使用「实体自身的数据」作为判断依据**

当实体本身的字段已经可以准确反映状态时，禁止引入外部缓存作为辅助判断：

```typescript
// ❌ 错误方式：用 workspace 级别的 localStorage 判断 asset 级别的完成状态
const draftLen = JSON.parse(localStorage.getItem(`eazzy_draft_scenes_${workspaceId}`))?.length
return draftLen > sortedScenes.length  // 与当前 asset 无关！

// ✅ 正确方式：直接用 asset 自身的字段判断
return sortedScenes.some(s => !s.videoUrl)  // 数据来自 asset 本身，粒度完全匹配
```

**3. 外部缓存作为辅助判断的安全条件（三项同时满足才允许使用）**


| 条件              | 说明                                                                   |
| --------------- | -------------------------------------------------------------------- |
| ① key 与实体 ID 绑定 | `localStorage.getItem(`draft_${assetId}`)` 而非 `draft_${workspaceId}` |
| ② 实体字段不足时才依赖    | 实体本身的字段无法完整反映状态                                                      |
| ③ 提供明确的过期/失效机制  | 缓存必须有 TTL 或主动清除的时机                                                   |


---

### 反面案例（本次真实错误）

```typescript
// ❌ 错误方式（多次修复都没找到这里）：
const isPartiallyComplete = computed<boolean>(() => {
  // Primary check（正确）
  const hasFailedScene = sortedScenes.value.some(s => !s.videoUrl)
  if (hasFailedScene) return true

  // Secondary check（BUG 所在）：
  // localStorage key 是 workspace 级别，但这里在判断 asset 级别的属性
  // 当同一 workspace 有多个视频资产时，会读到其他 asset 的 draft，导致误判
  const raw = localStorage.getItem(`eazzy_draft_scenes_${props.workspaceId}`)
  const draftLen = JSON.parse(raw)?.length ?? 0
  return draftLen > sortedScenes.value.length  // 🚨 粒度错配，跨实体污染
})

// ✅ 正确方式：只用实体自身的数据
const isPartiallyComplete = computed<boolean>(() => {
  if (props.asset.status !== 'completed') return false
  if (sortedScenes.value.length === 0) return false
  return sortedScenes.value.some(s => !s.videoUrl)  // ✅ 数据来自 asset 本身
})
```

---

### 检查清单（每次引入外部缓存做实体级判断时必查）

- 该缓存 key 的粒度是否与被判断实体完全一致？
- 实体自身的字段是否已经足够？（优先用实体自身字段）
- 若必须用缓存，key 是否绑定到了 `assetId` 而不是 `workspaceId`？
- 在多实体共存场景下（同一 workspace 多个资产）是否做过测试？
- 是否存在缓存被其他流程覆盖导致误判的可能？

---

## RULE 32: Switch-Case 字符串精确匹配原则 (P0 优先级) 🔥🔥🔥

**问题来源**: 视频功能开发 — 为 `worker-process.post.ts` 添加 `VIDEO_PIPELINE` job type 处理时，AI 将 `case 'VIDEO_PIPELINE'` 错误写成 `case ''`（空字符串），导致所有视频生成任务全部进入 `default` 分支并抛出 `Unknown job type: VIDEO_PIPELINE`，使已上线的登录用户视频生成功能完全不可用。

**根本原因分析**:

AI 在向已有的 switch-case 块中添加新 case 时，以空字符串 `''` 作为占位符写入，既未使用真实的枚举值，也未在提交前执行最基础的字符串校验。该空字符串 case 在实际运行中永远无法与 `'VIDEO_PIPELINE'` 匹配，但也不会在编译阶段报错（TypeScript 不会对 switch-case 字符串值进行穷尽性检查），导致错误直到运行时才暴露。

**Side Effect 影响范围**: 

```
修改前：VIDEO_PIPELINE 任务正常执行
修改后：case '' → 永远无法匹配 → default → throw 'Unknown job type: VIDEO_PIPELINE'
影响：所有登录用户的视频生成请求 100% 失败（P0 生产级别事故）
```

**核心原则**: 修改 switch-case 块时，新增的 case 字符串值必须与实际运行时的枚举值/字符串常量完全一致，绝不使用空字符串、`TODO`、占位符。

**实施要点**:

1. **修改前必须溯源 case 值的来源**
   - 确认 `pendingJob.type` 的实际值从哪里写入（如 `prisma.jobQueue.create({ data: { type: 'VIDEO_PIPELINE' } })`）
   - 搜索实际写入数据库的代码：`grep -rn "VIDEO_PIPELINE" server/`
   - 确认 Prisma Schema 中是否有枚举类型约束：`grep -A 10 "enum JobType" prisma/schema.prisma`

2. **直接对照 case 字符串 vs 实际写入值**
   ```typescript
   // ❌ 错误：空字符串占位符，永远无法匹配
   case '':
     await processVideoPipeline(pendingJob)
     break

   // ✅ 正确：与写入数据库的字符串完全一致
   case 'VIDEO_PIPELINE':
     await processVideoPipeline(pendingJob)
     break
   ```

3. **添加新 case 后，立即执行逆向验证**
   - 确认原有的所有 case（`SOURCE_PARSING`、`BRAND_ANALYSIS` 等）仍然完整，未被意外删除或修改
   - 确认 `default` 分支仍然存在，保留对真正未知类型的错误捕获能力
   - 在修改文件的同一次 Review 中搜索新增 case 的字符串，确认它出现在数据库写入处

4. **switch-case 修改的高危场景识别**
   ```
   高危场景（必须严格执行字符串溯源）：
   ① Job Queue 的任务类型分发（如 worker-process.post.ts）
   ② 状态机的状态转换（如 status: 'PENDING' → 'PROCESSING'）
   ③ 事件类型路由（如 SSE 事件类型分发）
   ④ API 路由中的动作分发（如 action: 'create' | 'update' | 'delete'）
   ```

**强制搜索流程**（每次修改 switch-case 前必须执行）:

```bash
# Step 1: 找到该 switch 变量的写入点（确认实际字符串值）
grep -rn "jobQueue.create\|type: '" server/

# Step 2: 确认 case 值与写入值完全一致（肉眼比对，不可跳过）
# case 'VIDEO_PIPELINE'  ←→  type: 'VIDEO_PIPELINE'  ✅

# Step 3: 确认修改后其他 case 完整存在（防止意外删除）
grep -n "case '" server/api/internal/worker-process.post.ts
```

**反面案例（本次真实错误）**:

```typescript
❌ 错误方式：
// 任务写入时: { type: 'VIDEO_PIPELINE' }
// Switch 修改后:
case '':                          ← 空字符串，永远无法匹配 'VIDEO_PIPELINE'
  await processVideoPipeline(pendingJob)
  break
default:
  throw new Error(`Unknown job type: ${pendingJob.type}`)
  ↑ 所有 VIDEO_PIPELINE 任务都到这里，抛出异常

✅ 正确方式：
// 先搜索: grep -rn "VIDEO_PIPELINE" server/
// 确认写入值: type: 'VIDEO_PIPELINE'
// 然后写 case：
case 'VIDEO_PIPELINE':            ← 与写入值完全一致
  await processVideoPipeline(pendingJob)
  break
```

**检查清单**:

- 搜索了新 case 字符串值在数据库/队列写入处的完整匹配
- 肉眼比对了 case 字符串与写入字符串（区分大小写）
- 验证了原有所有 case 均未被意外删除
- 确认 `default` 分支仍然存在并正确处理未知类型
- 未使用任何空字符串、TODO 或占位符作为 case 值

---

## RULE 33: 首页性能与 Prerender 开发原则 (P0 优先级) 🔥🔥🔥

**问题来源**: 2026-06 生产环境 — 首页 TTFB ~6s、广告转化低；`BeforeAfterShowcase` 首次进入动画不加载，切换语言后恢复。  
**技术文档**: `codingNotes/Coding-TechDoc/HomePage-newfeature.md` §10–11  
**核心原则**: 首页 TTFB 走 CDN 静态 HTML；Hero 以下区块的数据请求不得阻塞 SSR/prerender。

### 33.1 性能目标（分指标，禁止混谈）

| 指标 | 目标 | 说明 |
|------|------|------|
| **TTFB** | 全球 < 300ms（广告落地页） | 依赖 `prerender` + CDN，不靠 Lambda |
| **LCP** | 印尼移动端 < 2.5s | LCP 元素在 Hero 区，不在第 3 屏 showcase |
| **可交互（注册 CTA）** | Hero 主 CTA 应在静态 HTML 中可见 | 缩小 `ClientOnly` 范围（Phase 2） |
| **非 AI 操作** | < 100ms | 符合「别让我等」原则 |

### 33.2 Vercel + Supabase 部署铁律

1. **Function Regions 仅 `sin1`**（Supabase 在新加坡时，禁止 `iad1` / `gru1` 等多区域）
2. 修改 Region / `routeRules` / `prerender` 后必须 **Redeploy**
3. **计算贴着存储**：API 与带 DB 的 SSR 必须在 DB 同区域执行

### 33.3 首页数据拉取（`components/home/*`）

**Hero 以下任何命中 DB 或外部 API 的请求，必须使用客户端拉取：**

```typescript
// ✅ 正确 — 不阻塞 TTFB
const { data, status } = useLazyFetch('/api/public/xxx', {
  server: false,
  default: () => [],
})

// ❌ 禁止 — 阻塞 SSR；prerender 时可能烘焙空 payload，客户端不再重拉
const { data } = useFetch('/api/public/xxx')
```

**适用组件（当前）**: `SocialProofMarquee.vue`, `BeforeAfterShowcase.vue`  
**新增 showcase 类 API**: 在 `nuxt.config.ts` 的 `nitro.routeRules` 与顶层 `routeRules` 双写 `{ swr: 3600 }`

### 33.4 Prerender 与 SSR Payload 陷阱（Lesson Learned）

当 `prerender: true` 且组件使用 `useFetch`（默认 `server: true`）时：

1. 构建期 SSR 可能得到空数据 → 写入 HTML payload
2. 客户端 hydration 认为「已有数据」→ **跳过 refetch**
3. 依赖该数据的动画/UI 永久空转（切换语言因 `query` 变化才触发新请求）

**强制要求**:
- 首页 prerender 路由：`/` + 所有 i18n 前缀（`zh` `id` `ms` …），见 `nuxt.config.ts`
- prerender 页面内 showcase 数据：**一律 `server: false`**
- 动画 `watch` 异步数据：**不得**用 `onMounted` 已改变的 state（如 `animState === 'idle'`）作为唯一触发条件；数据到达时应 `clearTimer()` 后重启

### 33.5 广告落地与 i18n

- 付费广告链接使用**带语言前缀的直链**（如 `https://eazzyai.com/id`），不用裸 `/`
- 减少 `detectBrowserLanguage` 在 root 的 302 惩罚
- 注册转化路径优先：`/id/auth?view=sign_up&source=ads`

### 33.6 资源加载（Phase 2 待办，新代码须遵守）

| 资源 | 要求 |
|------|------|
| 视频（`VideoCapabilityShowcase`） | `preload="none"`；移动端考虑 poster；极致压缩 WebM/MP4 |
| 客户 Logo 墙 | `loading="lazy"`；WebP；控制单图体积 |
| `unifont` 等大字体 | 仅作 rare-char 兜底；`font-display: swap`；不得进入首屏关键路径 |
| 第三方脚本（GTM / Clarity） | 已知开销；新脚本需评估对移动端 LCP 影响 |

### 33.7 首页改动检查清单（PR 前必过）

```
□ 新增 useFetch/useAsyncData 是否在 components/home/* ？
  → 是：必须 server: false + 骨架/loading 态
□ 新增 /api/public/* ？
  → 是：routeRules 双写 swr: 3600
□ 修改动画 + 异步数据？
  → watch 内 clearTimer()；不依赖 onMounted 前的 idle 状态
□ 修改 nuxt.config routeRules？
  → 所有公共语言首页是否 prerender: true
□ Vercel 部署？
  → Function Regions 仅 sin1；已 Redeploy
□ 广告/外链？
  → 使用 localePath 直链，非 /${locale}/ 手拼
```

### 33.8 验证方式

1. **TTFB**: DevTools → 文档请求，印尼 VPN 或 Vercel 日志，应接近 CDN 静态响应
2. **Showcase API**: 出现在 HTML **之后**的 XHR/fetch，非 document 瀑布内阻塞
3. **BeforeAfter**: 首次进入 `/id` 无需切换语言即可看到 typing 动画与输出卡片
4. **SWR**: 响应头含 `x-nitro-cache: HIT`（二次请求）

