本文介绍非实时语音合成CosyVoice的HTTP调用方法，支持非流式和流式两种调用模式。

**用户指南**：参见[非实时语音合成](https://help.aliyun.com/zh/model-studio/non-realtime-tts-user-guide)。

**重要**

该功能仅在[中国内地部署范围](https://help.aliyun.com/zh/model-studio/regions/#080da663a75xh)（北京地域）下可用。

## **服务端点**

`POST https://dashscope.aliyuncs.com/api/v1/services/audio/tts/SpeechSynthesizer`

## **请求头**

| **参数** | **类型** | **是否必选** | **说明** |
| --- | --- | --- | --- |
| Authorization | string | 是   | 鉴权令牌，格式为`Bearer <your_api_key>`，使用时，将“`<your_api_key>`”替换为实际的API Key。 |
| Content-Type | string | 是   | 请求体的媒体类型，固定为`application/json`。 |
| X-DashScope-SSE | string | 否   | 用于控制是否以流式方式返回输出结果。仅在流式合成时使用该参数，参数值固定为`enable`。 |

| ## **请求体** | ## 非流式 ``` curl -X POST https://dashscope.aliyuncs.com/api/v1/services/audio/tts/SpeechSynthesizer \\ -H "Authorization: Bearer $DASHSCOPE_API_KEY" \\ -H "Content-Type: application/json" \\ -d '{ "model": "cosyvoice-v3-flash", "input": { "text": "我家的后面有一个很大的花园。", "voice": "longanyang", "format": "wav", "sample_rate": 24000 } }' ``` ## 流式 ``` curl -X POST https://dashscope.aliyuncs.com/api/v1/services/audio/tts/SpeechSynthesizer \\ -H "Authorization: Bearer $DASHSCOPE_API_KEY" \\ -H "Content-Type: application/json" \\ -H "X-DashScope-SSE: enable" \\ -d '{ "model": "cosyvoice-v3-flash", "input": { "text": "我家的后面有一个很大的花园。", "voice": "longanyang", "format": "wav", "sample_rate": 24000 } }' ``` |
| --- | --- |
| **model** `*string*` **（必选）** 语音合成模型。 取值范围： - cosyvoice-v3.5-plus - cosyvoice-v3.5-flash - cosyvoice-v3-plus - cosyvoice-v3-flash - cosyvoice-v2 |
| **input** `*object*` **（必选）** 输入参数对象**。** **属性** **text** `*string*` **（必选）** 待合成文本。 支持 SSML 和 LaTeX 格式输入。将待合成文本替换为对应格式即可。 - 使用 SSML 时，需同时将 `enable_ssml` 设置为 `true`。支持的 SSML 标签及用法，请参见[SSML标记语言介绍](https://help.aliyun.com/zh/model-studio/introduction-to-cosyvoice-ssml-markup-language)。 - 使用 LaTeX 时，将待合成文本替换为 LaTeX 格式即可，无需额外配置。支持的 LaTeX 语法及用法，请参见[LaTeX 公式转语音](https://help.aliyun.com/zh/model-studio/latex-capability-support-description)。 **voice** `*string*` **（必选）** 音色。 取值范围： - 系统音色：参见[CosyVoice音色列表](https://help.aliyun.com/zh/model-studio/cosyvoice-voice-list) - 声音复刻音色：如何创建音色请参见[CosyVoice声音复刻/设计API](https://help.aliyun.com/zh/model-studio/cosyvoice-clone-design-api) - 声音设计音色：如何创建音色请参见[CosyVoice声音复刻/设计API](https://help.aliyun.com/zh/model-studio/cosyvoice-clone-design-api) **format** `*string*` （可选） 音频编码格式。 默认值：mp3。 取值范围： - mp3 - pcm - wav - opus **sample\\_rate** `*integer*` （可选） 音频采样率（Hz）。 取值范围：8000, 16000, 22050（默认）, 24000, 44100, 48000。 **volume** `*integer*` （可选） 音量。 默认值：50。 取值范围：\\[0, 100\\]。 **rate** `*float*` （可选） 语速。 默认值：1.0。 取值范围：\\[0.5, 2.0\\]。 **bit\\_rate** `*integer*` （可选） 音频码率（单位：kbps）。 默认值：32。 取值范围：\\[6, 510\\]。 **重要** 仅在`format`为`opus`时支持使用该参数。 **pitch** `*float*` （可选） 音调。 默认值：1.0。 取值范围：\\[0.5, 2.0\\]。 **enable\\_ssml** `*boolean*` （可选） 是否开启SSML功能。 **word\\_timestamp\\_enabled** `*boolean*` （可选） 是否开启字级别时间戳。 默认值：false。 仅在流式输出模式下可用。支持的音色范围：cosyvoice-v3-flash、cosyvoice-v3-plus和cosyvoice-v2模型的复刻音色，以及[CosyVoice音色列表](https://help.aliyun.com/zh/model-studio/cosyvoice-voice-list)中标记为支持的系统音色。其他模型的复刻音色不支持此功能。 **seed** `*integer*` （可选） 生成时使用的随机数种子，使合成的效果产生变化。在模型版本、文本、音色及其他参数均相同的前提下，使用相同的seed可复现相同的合成结果。 默认值0。 取值范围：\\[0, 65535\\]。 **language\\_hints** `*array[string]*` （可选） **重要** - 此参数为数组，但当前版本仅处理第一个元素，因此建议只传入一个值。 - 此参数用于指定语音合成的目标语言，该设置与声音复刻时的样本音频的语种无关。如需设置复刻任务的源语言，请参见声音复刻API参考。 指定语音合成的目标语言，提升合成效果。 当数字、缩写、符号等朗读方式或者小语种合成效果不符合预期时使用，例如： - 数字朗读方式不符合预期，“hello, this is 110”读成“hello, this is one one zero”而非“hello, this is 幺幺零” - 符号朗读不准确，“@”读成“艾特”而非“at” - 小语种合成效果差，合成不自然 取值范围： - zh：中文 - en：英文 - fr：法语 - de：德语 - ja：日语 - ko：韩语 - ru：俄语 - pt：葡萄牙语 - th：泰语 - id：印尼语 - vi：越南语 **instruction** `*string*` （可选） 设置指令，用于控制方言、情感或角色等合成效果。 具体用法请参见[非实时语音合成](https://help.aliyun.com/zh/model-studio/non-realtime-tts-user-guide)。 **enable\\_aigc\\_tag** `*boolean*` （可选） 是否在生成的音频中添加AIGC隐性标识。设置为true时，会将隐性标识嵌入到支持格式（wav/mp3/opus）的音频中。 默认值：false。 仅cosyvoice-v3-flash、cosyvoice-v3-plus、cosyvoice-v2支持该功能。 **aigc\\_propagator** `*string*` （可选） 设置AIGC隐性标识中的 `ContentPropagator` 字段，用于标识内容的传播者。仅在 `enable_aigc_tag` 为 `true` 时生效。 默认值：阿里云UID。 仅cosyvoice-v3-flash、cosyvoice-v3-plus、cosyvoice-v2支持该功能。 **aigc\\_propagate\\_id** `*string*` （可选） 设置AIGC隐性标识中的 `PropagateID` 字段，用于唯一标识一次具体的传播行为。仅在 `enable_aigc_tag` 为 `true` 时生效。 默认值：本次语音合成请求Request ID。 仅cosyvoice-v3-flash、cosyvoice-v3-plus、cosyvoice-v2支持该功能。 **hot\\_fix** `*object*` （可选） 文本热修复配置，用于自定义指定词语的发音或对待合成文本进行替换。 cosyvoice-v2不支持该功能。 参数介绍： - pronunciation：自定义发音。指定词语的拼音标注，用于纠正默认发音不准确的情况。 - replace：文本替换。在语音合成前将指定词语替换为目标文本，替换后的文本将作为实际合成内容。 示例： ``` "hot_fix": { "pronunciation": [ {"天气": "tian1 qi4"} ], "replace": [ {"今天": "金天"} ] } ``` **enable\\_markdown\\_filter** `*boolean*` （可选） **重要** 仅cosyvoice-v3-flash复刻音色支持该功能。 是否启用 Markdown 过滤。启用该功能后，系统在合成语音前自动过滤输入文本中的 Markdown 标记符号，避免将其朗读为文字内容。 默认值：false。 取值范围： - true：启用Markdown过滤 - false：禁用Markdown过滤 |

| ## **返回体** | ## 非流式 ``` { "request_id": "ee88b03d-0457-9286-8c67-xxxxxxxxxxxx", "output": { "finish_reason": "stop", "audio": { "data": "", "url": "http://dashscope-result-bj.oss-cn-beijing.aliyuncs.com/pre/cosyvoice-v3-flash/20260304/xxxxxxxx/ee88b03d-0457-9286-8c67-xxxxxxxxxxxx.wav?xxxxxxx", "id": "audio_ee88b03d-0457-9286-8c67-xxxxxxxxxxxx", "expires_at": 1772697707 } }, "usage": { "characters": 15 } } ``` ## 流式 中间结果： ``` { "request_id": "8ac1cd04-06af-9a63-b031-xxxxxxxxxxxx", "output": { "finish_reason": "null", "type": "sentence-begin", "original_text": "我家的后面有一个很大的花园。", "sentence": { "index": 0, "words": [] }, "audio": { "data": "", "id": "audio_ee88b03d-0457-9286-8c67-xxxxxxxxxxxx", "expires_at": 1772697707 } }, "usage": { "characters": 15 } } ``` 最终结果： ``` { "request_id": "8ac1cd04-06af-9a63-b031-xxxxxxxxxxxx", "output": { "finish_reason": "stop", "audio": { "data": "", "url": "http://dashscope-result-bj.oss-cn-beijing.aliyuncs.com/pre/cosyvoice-v3-flash/20260304/xxxxxxxx/8ac1cd04-06af-9a63-b031-xxxxxxxxxxxx.wav?xxxxxxx", "id": "audio_8ac1cd04-06af-9a63-b031-xxxxxxxxxxxx", "expires_at": 1772698611, } }, "usage": { "characters": 15 } } ``` |
| --- | --- |
| **request\\_id** `*string*` 本次调用的唯一标识符。 |
| **output** `*object*` 模型返回的数据。 **属性** **finish\\_reason** `*string*` 任务停止原因，自然停止时为`stop`。 取值范围： - null：语音合成中 - stop：语音合成结束 **type** `*string*` 子事件类型。仅流式合成时返回该值。 取值范围： - sentence-begin：标识句子开始，返回待合成的句子文本内容 - sentence-synthesis：标识音频数据块 - 一个句子的合成过程中会产生多个`sentence-synthesis`事件，每个对应一个音频数据块 - 客户端需要按顺序接收这些音频数据块并以追加模式写入同一文件 - `sentence-synthesis`事件与其后的音频数据帧是一一对应的关系，不会出现错位 - sentence-end：标识句子结束，返回句子文本内容和累计的计费字符数 **original\\_text** `*string*` 对用户输入文本进行分句后的句内容。最后一个句子可能没有此字段。 **sentence** `*object*` 句子信息。 **属性** **index** `*integer*` 句子的编号，从0开始。 **words** `*array*` 每句话对应的字的信息。 **属性** **text** `*string*` 字。 **begin\\_index** `*integer*` 字在句子中的开始位置索引，从 0 开始。 **end\\_index** `*integer*` 字在句子中的结束位置索引，从 1 开始。 **begin\\_time** `*integer*` 字对应音频的开始时间戳，单位为毫秒。 **end\\_time** `*integer*` 字对应音频的结束时间戳，单位为毫秒。 **audio** `*object*` 合成的音频数据。 **属性** **data** `*string*` 流式合成时输出Base64格式音频数据。非流式合成时为空。 **url** `*string*` 模型输出的完整音频文件的URL，有效期24小时。 **id** `*string*` 模型输出的音频信息对应的ID。 **expires\\_at** `*integer*` `url` 过期时间戳。 |
| **usage** `*object*` 本次请求的字符用量。 **属性** **characters** `*integer*` 本次请求中计费的有效字符数。 |

.aliyun-docs-content .one-codeblocks pre { max-height: calc(80vh - 136px) !important; height: auto; } .tab-item { font-size: 12px !important; /\* 你可以根据需要调整字体大小 \*/ padding: 0px 5px !important; } .expandable-content { border-left: none !important; border-right: none !important; border-bottom: none !important; } .one-codeblocks.stick-top.section { overflow: hidden !important; }

.table-wrapper { overflow: visible !important; } /\* 调整 table 宽度 \*/ .aliyun-docs-content table.medium-width { max-width: 1018px; width: 100%; } .aliyun-docs-content table.table-no-border tr td:first-child { padding-left: 0; } .aliyun-docs-content table.table-no-border tr td:last-child { padding-right: 0; } /\* 支持吸顶 \*/ div:has(.aliyun-docs-content), .aliyun-docs-content .markdown-body { overflow: visible; } .stick-top { position: sticky; top: 46px; } /\*\*代码块字体\*\*/ /\* 减少表格中的代码块 margin，让表格信息显示更紧凑 \*/ .unionContainer .markdown-body table .help-code-block { margin: 0 !important; } /\* 减少表格中的代码块字号，让表格信息显示更紧凑 \*/ .unionContainer .markdown-body .help-code-block pre { font-size: 12px !important; } /\* 减少表格中的代码块字号，让表格信息显示更紧凑 \*/ .unionContainer .markdown-body .help-code-block pre code { font-size: 12px !important; } /\*\* API Reference 表格 \*\*/ .aliyun-docs-content table.api-reference tr td:first-child { margin: 0px; border-bottom: 1px solid #d8d8d8; } .aliyun-docs-content table.api-reference tr:last-child td:first-child { border-bottom: none; } .aliyun-docs-content table.api-reference p { color: #6e6e80; } .aliyun-docs-content table.api-reference b, i { color: #181818; } .aliyun-docs-content table.api-reference .collapse { border: none; margin-top: 4px; margin-bottom: 4px; } .aliyun-docs-content table.api-reference .collapse .expandable-title-bold { padding: 0; } .aliyun-docs-content table.api-reference .collapse .expandable-title { padding: 0; } .aliyun-docs-content table.api-reference .collapse .expandable-title-bold .title { margin-left: 16px; } .aliyun-docs-content table.api-reference .collapse .expandable-title .title { margin-left: 16px; } .aliyun-docs-content table.api-reference .collapse .expandable-title-bold i.icon { position: absolute; color: #777; font-weight: 100; } .aliyun-docs-content table.api-reference .collapse .expandable-title i.icon { position: absolute; color: #777; font-weight: 100; } .aliyun-docs-content table.api-reference .collapse.expanded .expandable-content { padding: 10px 14px 10px 14px !important; margin: 0; border: 1px solid #e9e9e9; } .aliyun-docs-content table.api-reference .collapse .expandable-title-bold b { font-size: 13px; font-weight: normal; color: #6e6e80; } .aliyun-docs-content table.api-reference .collapse .expandable-title b { font-size: 13px; font-weight: normal; color: #6e6e80; } .aliyun-docs-content table.api-reference .tabbed-content-box { border: none; } .aliyun-docs-content table.api-reference .tabbed-content-box section { padding: 8px 0 !important; } .aliyun-docs-content table.api-reference .tabbed-content-box.mini .tab-box { /\* position: absolute; left: 40px; right: 0; \*/ } .aliyun-docs-content .margin-top-33 { margin-top: 33px !important; } .aliyun-docs-content .two-codeblocks pre { max-height: calc(50vh - 136px) !important; height: auto; } .expandable-content section { border-bottom: 1px solid #e9e9e9; padding-top: 6px; padding-bottom: 4px; } .expandable-content section:last-child { border-bottom: none; } .expandable-content section:first-child { padding-top: 0; }


CosyVoice支持的系统音色如下表所示。若需要更加个性化的音色，可通过声音复刻功能免费定制专属音色，详情请参见[使用复刻的音色进行语音合成](https://help.aliyun.com/zh/model-studio/cosyvoice-clone-design-api#b6d3449fb336v)。

进行语音合成时：

-   每个模型（`model`）仅支持一组特定的音色（`voice`），不能将一个模型的音色与另一个模型混用
    
-   待合成文本（`text`）必须在所选音色支持的语言范围内，否则可能出现发音错误或不自然
    
-   对于支持SSML的音色，如需使用SSML功能，请参见[SSML标记语言介绍](https://help.aliyun.com/zh/model-studio/introduction-to-cosyvoice-ssml-markup-language)，在请求参数`text`中填写符合SSML规范的内容
    
-   对于支持Instruct的音色，如需使用Instruct功能，请在请求参数`instruction`中填写符合Instruct格式要求的文本
    
-   对于支持时间戳的音色，如需使用时间戳功能，请通过请求参数`word_timestamp_enabled`（Java SDK中为`enableWordTimestamp`）开启该功能
    

## **cosyvoice-v3-flash音色列表**

| **适用场景** | **音色信息** | **特性支持** | **音频试听（右键保存音频）** |
| --- | --- | --- | --- |
| 社交陪伴（标杆音色） | **名称**：龙安洋 **voice参数**：longanyang **特质**：阳光大男孩 **年龄**：20~30岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：支持 时间戳：支持 **点击查看Instruct设置** **Instruct文本必须使用中文**，须严格按以下格式填写，包括标点符号，不可遗漏结尾句号。支持的情感值：`neutral`、`fearful`、`angry`、`sad`、`surprised`、`happy`、`disgusted`。 1. 设置情感 - 格式：“`你说话的情感是<情感值>。`” - 示例：“`你说话的情感是neutral。`” 2. 设置场景+情感 - 格式：“`你正在进行<场景>，你说话的情感是<情感值>。`” - 示例：“`你正在进行闲聊互动，你说话的情感是neutral。`” - 支持的场景：`闲聊互动`、`新闻播报`、`广告促销`、`比赛解说`、`一些儿童内容解说`、`语音导航`、`脱口秀表演`。 3. 设置角色+情感 - 格式：“`你现在说话的角色是<角色>，你说话的情感是<情感值>。`” - 示例：“`你现在说话的角色是一个旁白，你说话的情感是neutral。`” - 支持的角色：`一个旁白`。 4. 设置身份+情感 - 格式：“`你正在以一个<身份>的身份说话，你说话的情感是<情感值>。`” - 示例：“`你正在以一个故事机的身份说话，你说话的情感是neutral。`” - 支持的身份：`故事机`。 |     |
| **名称**：龙安欢（V3） **voice参数**：longanhuan\\_v3 **特质**：欢脱元气女 **年龄**：20~30岁 **语言**：中文（普通话、广东话、东北话、河南话、湖南话、陕西话、山东话、四川话、安徽话）、英文 | SSML：支持 Instruct：支持 时间戳：支持 **点击查看Instruct设置** **Instruct文本必须使用中文**，须严格按以下格式填写，包括标点符号，不可遗漏结尾句号。 设置方言： - 格式：“`请用<方言>表达。`” - 示例：“`请用山东话表达。`” - 支持的方言：`普通话`、`广东话`、`东北话`、`河南话`、`湖南话`、`陕西话`、`山东话`、`四川话`、`安徽话` |     |
| **名称**：龙安欢 **voice参数**：longanhuan **特质**：欢脱元气女 **年龄**：20~30岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：支持 时间戳：支持 **点击查看Instruct设置** **Instruct文本必须使用中文**，须严格按以下格式填写，包括标点符号，不可遗漏结尾句号。支持的情感值：`neutral`、`fearful`、`angry`、`sad`、`surprised`、`happy`、`disgusted`。 1. 设置情感 - 格式：“`你说话的情感是<情感值>。`” - 示例：“`你说话的情感是neutral。`” 2. 设置场景+情感 - 格式：“`你正在进行<场景>，你说话的情感是<情感值>。`” - 示例：“`你正在进行闲聊对话，你说话的情感是neutral。`” - 支持的场景：`闲聊对话`、`课堂教学`、`比赛解说`、`深夜电台广播`、`剧情解说`、`诗歌朗诵`、`科普知识推广`、`产品推广`、`脱口秀表演`。 3. 设置角色+情感 - 格式：“`你说话的角色是<角色>，你说话的情感是<情感值>。`” - 示例：“`你说话的角色是温和客服，你说话的情感是neutral。`” - 支持的角色：`温和客服`。 |     |
| 童声（标杆音色） | **名称**：龙呼呼 **voice参数**：longhuhu\\_v3 **特质**：天真烂漫女童 **年龄**：6~10岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：支持 时间戳：支持 **点击查看Instruct设置** **Instruct文本必须使用中文**，须严格按以下格式填写，包括标点符号，不可遗漏结尾句号。支持的情感值：`neutral`、`fearful`、`angry`、`sad`、`surprised`、`happy`、`disgusted`。 1. 设置情感 - 格式：“`你说话的情感是<情感值>。`” - 示例：“`你说话的情感是neutral。`” 2. 设置场景+情感 - 格式：“`你正在进行<场景>，你说话的情感是<情感值>。`” - 示例：“`你正在进行自由对话，你说话的情感是neutral。`” - 支持的场景：`自由对话`、`广告促销`。 3. 设置角色+情感 - 格式：“`你说话的角色是<角色>，你说话的情感是<情感值>。`” - 示例：“`你说话的角色是傲娇公主，你说话的情感是neutral。`” - 支持的角色：`傲娇公主`、`元气少女`、`可爱孩童`、`机器人`、`小猪佩奇`。 4. 设置身份+情感 - 格式：“`你正在以一个<身份>的身份说话，你说话的情感是<情感值>。`” - 示例：“`你正在以一个故事机的身份说话，你说话的情感是neutral。`” - 支持的身份：`故事机`、`儿童玩具`。 |     |
| 智能玩具/儿童故事机 | **名称**：龙泡泡 **voice参数**：longpaopao\\_v3 **特质**：飞天泡泡音 **年龄**：6~15岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙杰力豆 **voice参数**：longjielidou\\_v3 **特质**：阳光顽皮男 **年龄**：10岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙仙 **voice参数**：longxian\\_v3 **特质**：豪放可爱女 **年龄**：12岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙铃 **voice参数**：longling\\_v3 **特质**：稚气呆板女 **年龄**：10岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 消费电子-儿童有声书 | **名称**：龙闪闪 **voice参数**：longshanshan\\_v3 **特质**：戏剧化童声 **年龄**：6~15岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙牛牛 **voice参数**：longniuniu\\_v3 **特质**：阳光男童声 **年龄**：6~15岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 方言  | **名称**：龙嘉欣 **voice参数**：longjiaxin\\_v3 **特质**：优雅粤语女 **年龄**：30~35岁 **语言**：中文（粤语）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙嘉怡 **voice参数**：longjiayi\\_v3 **特质**：知性粤语女 **年龄**：25~30岁 **语言**：中文（粤语）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安粤 **voice参数**：longanyue\\_v3 **特质**：欢脱粤语男 **年龄**：25~35岁 **语言**：中文（粤语）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙老铁 **voice参数**：longlaotie\\_v3 **特质**：东北直率男 **年龄**：25~30岁 **语言**：中文（东北话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙陕哥 **voice参数**：longshange\\_v3 **特质**：原味陕北男 **年龄**：25~35岁 **语言**：中文（陕西话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安闽 **voice参数**：longanmin\\_v3 **特质**：清纯萝莉女 **年龄**：18~25岁 **语言**：中文（闽南话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 出海营销 | **名称**：loongkyong **voice参数**：loongkyong\\_v3 **特质**：韩语女 **年龄**：25~30岁 **语言**：韩语 **重要** 该音色仅支持北京地域，暂不支持新加坡地域。 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：Riko **voice参数**：loongriko\\_v3 **特质**：二次元霓虹女 **年龄**：18~25岁 **语言**：日语 **重要** 该音色仅支持北京地域，暂不支持新加坡地域。 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongtomoka **voice参数**：loongtomoka\\_v3 **特质**：日语女 **年龄**：30~35岁 **语言**：日语 **重要** 该音色仅支持北京地域，暂不支持新加坡地域。 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongabby **voice参数**：loongabby\\_v3 **特质**：美式英文女 **年龄**：30~35岁 **语言**：美式英语 **重要** 该音色仅支持北京地域，暂不支持新加坡地域。 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongandy **voice参数**：loongandy\\_v3 **特质**：美式英文男 **年龄**：30~35岁 **语言**：美式英语 **重要** 该音色仅支持北京地域，暂不支持新加坡地域。 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongannie **voice参数**：loongannie\\_v3 **特质**：美式英文女 **年龄**：30~35岁 **语言**：美式英语 **重要** 该音色仅支持北京地域，暂不支持新加坡地域。 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongava **voice参数**：loongava\\_v3 **特质**：美式英文女 **年龄**：35~40岁 **语言**：美式英语 **重要** 该音色仅支持北京地域，暂不支持新加坡地域。 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongbeth **voice参数**：loongbeth\\_v3 **特质**：美式英文女 **年龄**：35~40岁 **语言**：美式英语 **重要** 该音色仅支持北京地域，暂不支持新加坡地域。 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongbetty **voice参数**：loongbetty\\_v3 **特质**：美式英文女 **年龄**：35~40岁 **语言**：美式英语 **重要** 该音色仅支持北京地域，暂不支持新加坡地域。 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongcally **voice参数**：loongcally\\_v3 **特质**：美式英文女 **年龄**：25~30岁 **语言**：美式英语 **重要** 该音色仅支持北京地域，暂不支持新加坡地域。 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongcindy **voice参数**：loongcindy\\_v3 **特质**：美式英文女 **年龄**：30~35岁 **语言**：美式英语 **重要** 该音色仅支持北京地域，暂不支持新加坡地域。 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongdavid **voice参数**：loongdavid\\_v3 **特质**：美式英文男 **年龄**：35~40岁 **语言**：美式英语 **重要** 该音色仅支持北京地域，暂不支持新加坡地域。 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongdonna **voice参数**：loongdonna\\_v3 **特质**：美式英文女 **年龄**：35~40岁 **语言**：美式英语 **重要** 该音色仅支持北京地域，暂不支持新加坡地域。 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongemily **voice参数**：loongemily\\_v3 **特质**：英式英文女 **年龄**：35~40岁 **语言**：英式英语 **重要** 该音色仅支持北京地域，暂不支持新加坡地域。 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongeric **voice参数**：loongeric\\_v3 **特质**：英式英文男 **年龄**：35~40岁 **语言**：英式英语 **重要** 该音色仅支持北京地域，暂不支持新加坡地域。 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongluna **voice参数**：loongluna\\_v3 **特质**：英式英文女 **年龄**：35~40岁 **语言**：英式英语 **重要** 该音色仅支持北京地域，暂不支持新加坡地域。 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongluca **voice参数**：loongluca\\_v3 **特质**：英式英文男 **年龄**：25~30岁 **语言**：英式英语 **重要** 该音色仅支持北京地域，暂不支持新加坡地域。 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongtomoya **voice参数**：loongtomoya\\_v3 **特质**：日语男 **年龄**：30~35岁 **语言**：日语 **重要** 该音色仅支持北京地域，暂不支持新加坡地域。 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：Yuuna **voice参数**：loongyuuna\\_v3 **特质**：日语女 **年龄**：18~25岁 **语言**：日语 **重要** 该音色仅支持北京地域，暂不支持新加坡地域。 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：Yuuma **voice参数**：loongyuuma\\_v3 **特质**：日语男 **年龄**：20~25岁 **语言**：日语 **重要** 该音色仅支持北京地域，暂不支持新加坡地域。 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：Jihun **voice参数**：loongjihun\\_v3 **特质**：韩语男 **年龄**：25~30岁 **语言**：韩语 **重要** 该音色仅支持北京地域，暂不支持新加坡地域。 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongindah **voice参数**：loongindah\\_v3 **特质**：印尼女 **年龄**：22~27岁 **语言**：印尼语 **重要** 该音色仅支持北京地域，暂不支持新加坡地域。 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| 诗词朗诵 | **名称**：龙飞 **voice参数**：longfei\\_v3 **特质**：热血磁性男 **年龄**：30~35岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 电话销售 | **名称**：龙应笑 **voice参数**：longyingxiao\\_v3 **特质**：清甜推销女 **年龄**：20~25岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 客服  | **名称**：龙应询 **voice参数**：longyingxun\\_v3 **特质**：年轻青涩男 **年龄**：20~25岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙应静 **voice参数**：longyingjing\\_v3 **特质**：低调冷静女 **年龄**：25~35岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙应聆 **voice参数**：longyingling\\_v3 **特质**：温和共情女 **年龄**：25~30岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙应桃 **voice参数**：longyingtao\\_v3 **特质**：温柔淡定女 **年龄**：25~30岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 语音助手 | **名称**：龙小淳 **voice参数**：longxiaochun\\_v3 **特质**：知性积极女 **年龄**：25~30岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙小夏 **voice参数**：longxiaoxia\\_v3 **特质**：沉稳权威女 **年龄**：25~30岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：YUMI **voice参数**：longyumi\\_v3 **特质**：正经青年女 **年龄**：20~25岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安昀 **voice参数**：longanyun\\_v3 **特质**：居家暖男 **年龄**：30~35岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安温 **voice参数**：longanwen\\_v3 **特质**：优雅知性女 **年龄**：25~35岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安莉 **voice参数**：longanli\\_v3 **特质**：利落从容女 **年龄**：25~35岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安朗 **voice参数**：longanlang\\_v3 **特质**：清爽利落男 **年龄**：20~25岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙应沐 **voice参数**：longyingmu\\_v3 **特质**：优雅知性女 **年龄**：25~30岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 社交陪伴 | **名称**：龙安台 **voice参数**：longantai\\_v3 **特质**：嗲甜台湾女 **年龄**：20~25岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙华 **voice参数**：longhua\\_v3 **特质**：元气甜美女 **年龄**：20~25岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙橙 **voice参数**：longcheng\\_v3 **特质**：智慧青年男 **年龄**：20~25岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙泽 **voice参数**：longze\\_v3 **特质**：温暖元气男 **年龄**：25~30岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙哲 **voice参数**：longzhe\\_v3 **特质**：呆板大暖男 **年龄**：25~30岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙颜 **voice参数**：longyan\\_v3 **特质**：温暖春风女 **年龄**：30~35岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙星 **voice参数**：longxing\\_v3 **特质**：温婉邻家女 **年龄**：20~25岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙天 **voice参数**：longtian\\_v3 **特质**：磁性理智男 **年龄**：30~35岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙婉 **voice参数**：longwan\\_v3 **特质**：细腻柔声女 **年龄**：20~30岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙嫱 **voice参数**：longqiang\\_v3 **特质**：浪漫风情女 **年龄**：30~35岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙菲菲 **voice参数**：longfeifei\\_v3 **特质**：甜美娇气女 **年龄**：20~25岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙浩 **voice参数**：longhao\\_v3 **特质**：多情忧郁男 **年龄**：30~35岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安柔 **voice参数**：longanrou\\_v3 **特质**：温柔闺蜜女 **年龄**：20~35岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙寒 **voice参数**：longhan\\_v3 **特质**：温暖痴情男 **年龄**：30~35岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安智 **voice参数**：longanzhi\\_v3 **特质**：睿智轻熟男 **年龄**：25~35岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安灵 **voice参数**：longanling\\_v3 **特质**：思维灵动女 **年龄**：20~30岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安雅 **voice参数**：longanya\\_v3 **特质**：高雅气质女 **年龄**：25~35岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安亲 **voice参数**：longanqin\\_v3 **特质**：亲和活泼女 **年龄**：20~25岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 有声书 | **名称**：龙妙 **voice参数**：longmiao\\_v3 **特质**：抑扬顿挫女 **年龄**：25~30岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙三叔 **voice参数**：longsanshu\\_v3 **特质**：沉稳质感男 **年龄**：25~45岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙媛 **voice参数**：longyuan\\_v3 **特质**：温暖治愈女 **年龄**：35~40岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙悦 **voice参数**：longyue\\_v3 **特质**：温暖磁性女 **年龄**：30~35岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙修 **voice参数**：longxiu\\_v3 **特质**：博才说书男 **年龄**：25~35岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙楠 **voice参数**：longnan\\_v3 **特质**：睿智青年男 **年龄**：25~30岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙婉君 **voice参数**：longwanjun\\_v3 **特质**：细腻柔声女 **年龄**：20~30岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙逸尘 **voice参数**：longyichen\\_v3 **特质**：洒脱活力男 **年龄**：20~30岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙老伯 **voice参数**：longlaobo\\_v3 **特质**：沧桑岁月爷 **年龄**：60岁以上 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙老姨 **voice参数**：longlaoyi\\_v3 **特质**：烟火从容阿姨 **年龄**：60岁以上 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 短视频配音 | **名称**：龙机器 **voice参数**：longjiqi\\_v3 **特质**：呆萌机器人 **年龄**：20~30岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙猴哥 **voice参数**：longhouge\\_v3 **特质**：经典猴哥 **年龄**：20~25岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙黛玉 **voice参数**：longdaiyu\\_v3 **特质**：娇率才女音 **年龄**：15~25岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 直播带货 | **名称**：龙安燃 **voice参数**：longanran\\_v3 **特质**：活泼质感女 **年龄**：30~40岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安宣 **voice参数**：longanxuan\\_v3 **特质**：经典直播女 **年龄**：30~40岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 新闻播报 | **名称**：龙硕 **voice参数**：longshuo\\_v3 **特质**：博才干练男 **年龄**：25~30岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙书 **voice参数**：longshu\\_v3 **特质**：沉稳青年男 **年龄**：20~25岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：Bella3.0 **voice参数**：loongbella\\_v3 **特质**：精准干练女 **年龄**：25~30岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |

## **cosyvoice-v3-plus音色列表**

| **适用场景** | **音色信息** | **特性支持** | **音频试听（右键保存音频）** |
| --- | --- | --- | --- |
| 社交陪伴（标杆音色） | **名称**：龙安洋 **voice参数**：longanyang **特质**：阳光大男孩 **年龄**：20~30岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：支持 时间戳：支持 **点击查看Instruct设置** **Instruct文本必须使用中文**，须严格按以下格式填写，包括标点符号，不可遗漏结尾句号。支持的情感值：`neutral`、`fearful`、`angry`、`sad`、`surprised`、`happy`、`disgusted`。 1. 设置情感 - 格式：“`你说话的情感是<情感值>。`” - 示例：“`你说话的情感是neutral。`” 2. 设置场景+情感 - 格式：“`你正在进行<场景>，你说话的情感是<情感值>。`” - 示例：“`你正在进行闲聊互动，你说话的情感是neutral。`” - 支持的场景：`闲聊互动`、`新闻播报`、`广告促销`、`比赛解说`、`一些儿童内容解说`、`语音导航`、`脱口秀表演`。 3. 设置角色+情感 - 格式：“`你现在说话的角色是<角色>，你说话的情感是<情感值>。`” - 示例：“`你现在说话的角色是一个旁白，你说话的情感是neutral。`” - 支持的角色：`一个旁白`。 4. 设置身份+情感 - 格式：“`你正在以一个<身份>的身份说话，你说话的情感是<情感值>。`” - 示例：“`你正在以一个故事机的身份说话，你说话的情感是neutral。`” - 支持的身份：`故事机`。 |     |
| **名称**：龙安欢 **voice参数**：longanhuan **特质**：欢脱元气女 **年龄**：20~30岁 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：支持 时间戳：支持 **点击查看Instruct设置** **Instruct文本必须使用中文**，须严格按以下格式填写，包括标点符号，不可遗漏结尾句号。支持的情感值：`neutral`、`fearful`、`angry`、`sad`、`surprised`、`happy`、`disgusted`。 1. 设置情感 - 格式：“`你说话的情感是<情感值>。`” - 示例：“`你说话的情感是neutral。`” 2. 设置场景+情感 - 格式：“`你正在进行<场景>，你说话的情感是<情感值>。`” - 示例：“`你正在进行闲聊互动，你说话的情感是neutral。`” - 支持的场景：`闲聊对话`、`比赛解说`、`深夜电台广播`、`诗歌朗诵`、`科普知识推广`、`产品推广`、`脱口秀表演`。 3. 设置角色+情感 - 格式：“`你说话的角色是<角色>，你说话的情感是<情感值>。`” - 示例：“`你说话的角色是温和客服，你说话的情感是neutral。`” - 支持的角色：`温和客服`。 |     |

## **cosyvoice-v2音色列表**

| **适用场景** | **音色信息** | **特性支持** | **音频试听（右键保存音频）** |
| --- | --- | --- | --- |
| 电话销售 | **名称**：龙应笑 **voice参数**：longyingxiao **特质**：清甜推销女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 短视频配音 | **名称**：龙机器 **voice参数**：longjiqi **特质**：呆萌机器人 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙猴哥 **voice参数**：longhouge **特质**：经典猴哥 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙机心 **voice参数**：longjixin **特质**：毒舌心机女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安粤 **voice参数**：longanyue **特质**：欢脱粤语男 **语言**：中文（粤语）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙陕哥 **voice参数**：longshange **特质**：原味陕北男 **语言**：中文（陕西话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安敏 **voice参数**：longanmin **特质**：甜美闽南女 **语言**：中文（闽南话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙黛玉 **voice参数**：longdaiyu **特质**：娇率才女音 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙高僧 **voice参数**：longgaoseng **特质**：得道高僧音 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 语音助手 | **名称**：龙安莉 **voice参数**：longanli **特质**：利落从容女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安朗 **voice参数**：longanlang **特质**：清爽利落男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安温 **voice参数**：longanwen **特质**：优雅知性女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安昀 **voice参数**：longanyun **特质**：居家暖男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：YUMI **voice参数**：longyumi\\_v2 **特质**：正经青年女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙小淳 **voice参数**：longxiaochun\\_v2 **特质**：知性积极女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙小夏 **voice参数**：longxiaoxia\\_v2 **特质**：沉稳权威女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 有声书 | **名称**：龙逸尘 **voice参数**：longyichen **特质**：洒脱活力男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙婉君 **voice参数**：longwanjun **特质**：细腻柔声女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙老伯 **voice参数**：longlaobo **特质**：沧桑岁月爷 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙老姨 **voice参数**：longlaoyi **特质**：烟火从容阿姨 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙白芷 **voice参数**：longbaizhi **特质**：睿气旁白女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙三叔 **voice参数**：longsanshu **特质**：沉稳质感男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙修 **voice参数**：longxiu\\_v2 **特质**：博才说书男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙妙 **voice参数**：longmiao\\_v2 **特质**：抑扬顿挫女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙悦 **voice参数**：longyue\\_v2 **特质**：温暖磁性女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙楠 **voice参数**：longnan\\_v2 **特质**：睿智青年男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙媛 **voice参数**：longyuan\\_v2 **特质**：温暖治愈女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 社交陪伴 | **名称**：龙安亲 **voice参数**：longanqin **特质**：亲和活泼女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安雅 **voice参数**：longanya **特质**：高雅气质女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安朔 **voice参数**：longanshuo **特质**：干净清爽男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安灵 **voice参数**：longanling **特质**：思维灵动女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安智 **voice参数**：longanzhi **特质**：睿智轻熟男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安柔 **voice参数**：longanrou **特质**：温柔闺蜜女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙嫱 **voice参数**：longqiang\\_v2 **特质**：浪漫风情女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙寒 **voice参数**：longhan\\_v2 **特质**：温暖痴情男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙星 **voice参数**：longxing\\_v2 **特质**：温婉邻家女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙华 **voice参数**：longhua\\_v2 **特质**：元气甜美女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙婉 **voice参数**：longwan\\_v2 **特质**：积极知性女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙橙 **voice参数**：longcheng\\_v2 **特质**：智慧青年男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙菲菲 **voice参数**：longfeifei\\_v2 **特质**：甜美娇气女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙小诚 **voice参数**：longxiaocheng\\_v2 **特质**：磁性低音男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙哲 **voice参数**：longzhe\\_v2 **特质**：呆板大暖男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙颜 **voice参数**：longyan\\_v2 **特质**：温暖春风女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙天 **voice参数**：longtian\\_v2 **特质**：磁性理智男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙泽 **voice参数**：longze\\_v2 **特质**：温暖元气男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙邵 **voice参数**：longshao\\_v2 **特质**：积极向上男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙浩 **voice参数**：longhao\\_v2 **特质**：多情忧郁男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙深 **voice参数**：kabuleshen\\_v2 **特质**：实力歌手男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 童声（标杆音色） | **名称**：龙呼呼 **voice参数**：longhuhu **特质**：天真烂漫女童 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 消费电子-教育培训 | **名称**：龙安培 **voice参数**：longanpei **特质**：青少年教师女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 消费电子-儿童陪伴 | **名称**：龙汪汪 **voice参数**：longwangwang **特质**：台湾少年音 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙泡泡 **voice参数**：longpaopao **特质**：飞天泡泡音 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 消费电子-儿童有声书 | **名称**：龙闪闪 **voice参数**：longshanshan **特质**：戏剧化童声 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙牛牛 **voice参数**：longniuniu **特质**：阳光男童声 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 客服  | **名称**：龙应沐 **voice参数**：longyingmu **特质**：优雅知性女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙应询 **voice参数**：longyingxun **特质**：年轻青涩男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙应催 **voice参数**：longyingcui **特质**：严肃催收男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙应答 **voice参数**：longyingda **特质**：开朗高音女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙应静 **voice参数**：longyingjing **特质**：低调冷静女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙应严 **voice参数**：longyingyan **特质**：义正严辞女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙应甜 **voice参数**：longyingtian **特质**：温柔甜美女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙应冰 **voice参数**：longyingbing **特质**：尖锐强势女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙应桃 **voice参数**：longyingtao **特质**：温柔淡定女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙应聆 **voice参数**：longyingling **特质**：温和共情女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 直播带货 | **名称**：龙安燃 **voice参数**：longanran **特质**：活泼质感女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安宣 **voice参数**：longanxuan **特质**：经典直播女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安冲 **voice参数**：longanchong **特质**：激情推销男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙安萍 **voice参数**：longanping **特质**：高亢直播女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 童声  | **名称**：龙杰力豆 **voice参数**：longjielidou\\_v2 **特质**：阳光顽皮男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙铃 **voice参数**：longling\\_v2 **特质**：稚气呆板女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙可 **voice参数**：longke\\_v2 **特质**：懵懂乖乖女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙仙 **voice参数**：longxian\\_v2 **特质**：豪放可爱女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 方言  | **名称**：龙老铁 **voice参数**：longlaotie\\_v2 **特质**：东北直率男 **语言**：中文（东北话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙嘉怡 **voice参数**：longjiayi\\_v2 **特质**：知性粤语女 **语言**：中文（粤语）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙桃 **voice参数**：longtao\\_v2 **特质**：积极粤语女 **语言**：中文（粤语）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 诗词朗诵 | **名称**：龙飞 **voice参数**：longfei\\_v2 **特质**：热血磁性男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：李白 **voice参数**：libai\\_v2 **特质**：古代诗仙男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙津 **voice参数**：longjin\\_v2 **特质**：优雅温润男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 新闻播报 | **名称**：龙书 **voice参数**：longshu\\_v2 **特质**：沉稳青年男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：Bella2.0 **voice参数**：loongbella\\_v2 **特质**：精准干练女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙硕 **voice参数**：longshuo\\_v2 **特质**：博才干练男 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙小白 **voice参数**：longxiaobai\\_v2 **特质**：沉稳播报女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：龙婧 **voice参数**：longjing\\_v2 **特质**：典型播音女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| **名称**：loongstella **voice参数**：loongstella\\_v2 **特质**：飒爽利落女 **语言**：中文（普通话）、英文 | SSML：支持 Instruct：不支持 时间戳：支持 |     |
| 出海营销 | **名称**：loongyuuna **voice参数**：loongyuuna\\_v2 **特质**：元气霓虹女 **语言**：日语 | SSML：支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongyuuma **voice参数**：loongyuuma\\_v2 **特质**：干练霓虹男 **语言**：日语 | SSML：支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongjihun **voice参数**：loongjihun\\_v2 **特质**：阳光韩国男 **语言**：韩语 | SSML：支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongeva **voice参数**：loongeva\\_v2 **特质**：知性英文女 **语言**：英式英文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongbrian **voice参数**：loongbrian\\_v2 **特质**：沉稳英文男 **语言**：英式英文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongluna **voice参数**：loongluna\\_v2 **特质**：英式英文女 **语言**：英式英文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongluca **voice参数**：loongluca\\_v2 **特质**：英式英文男 **语言**：英式英文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongemily **voice参数**：loongemily\\_v2 **特质**：英式英文女 **语言**：英式英文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongeric **voice参数**：loongeric\\_v2 **特质**：英式英文男 **语言**：英式英文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongabby **voice参数**：loongabby\\_v2 **特质**：美式英文女 **语言**：美式英文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongannie **voice参数**：loongannie\\_v2 **特质**：美式英文女 **语言**：美式英文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongandy **voice参数**：loongandy\\_v2 **特质**：美式英文男 **语言**：美式英文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongava **voice参数**：loongava\\_v2 **特质**：美式英文女 **语言**：美式英文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongbeth **voice参数**：loongbeth\\_v2 **特质**：美式英文女 **语言**：美式英文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongbetty **voice参数**：loongbetty\\_v2 **特质**：美式英文女 **语言**：美式英文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongcindy **voice参数**：loongcindy\\_v2 **特质**：美式英文女 **语言**：美式英文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongcally **voice参数**：loongcally\\_v2 **特质**：美式英文女 **语言**：美式英文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongdavid **voice参数**：loongdavid\\_v2 **特质**：美式英文男 **语言**：美式英文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongdonna **voice参数**：loongdonna\\_v2 **特质**：美式英文女 **语言**：美式英文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongkyong **voice参数**：loongkyong\\_v2 **特质**：韩语女 **语言**：韩语 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongtomoka **voice参数**：loongtomoka\\_v2 **特质**：日语女 **语言**：日语 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| **名称**：loongtomoya **voice参数**：loongtomoya\\_v2 **特质**：日语男 **语言**：日语 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |

## cosyvoice-v1音色列表

cosyvoice-v1音色不支持方言。

| **适用场景** | **音色信息** | **特性支持** | **音频试听（右键保存音频）** |
| --- | --- | --- | --- |
| 语音助手、 导航播报、 聊天数字人 | **名称**：龙婉 **voice参数**：longwan **语言**：中文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| 语音助手、 导航播报、 聊天数字人 | **名称**：龙橙 **voice参数**：longcheng **语言**：中文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| 语音助手、 导航播报、 聊天数字人 | **名称**：龙华 **voice参数**：longhua **语言**：中文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| 语音助手、 导航播报、 聊天数字人 | **名称**：龙小淳 **voice参数**：longxiaochun **语言**：中文、英文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| 语音助手、聊天数字人 | **名称**：龙小夏 **voice参数**：longxiaoxia **语言**：中文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| 语音助手、导航播报、聊天数字人 | **名称**：龙小诚 **voice参数**：longxiaocheng **语言**：中文、英文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| 聊天数字人、有声书、语音助手 | **名称**：龙小白 **voice参数**：longxiaobai **语言**：中文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| 新闻播报、有声书、语音助手、直播带货、导航播报 | **名称**：龙老铁 **voice参数**：longlaotie **语言**：中文东北口音 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| 有声书、语音助手、导航播报、新闻播报、智能客服 | **名称**：龙书 **voice参数**：longshu **语言**：中文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| 语音助手、导航播报、新闻播报、客服催收 | **名称**：龙硕 **voice参数**：longshuo **语言**：中文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| 语音助手、导航播报、新闻播报、客服催收 | **名称**：龙婧 **voice参数**：longjing **语言**：中文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| 客服催收、导航播报、有声书、语音助手 | **名称**：龙妙 **voice参数**：longmiao **语言**：中文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| 语音助手、诗词朗诵、有声书朗读、导航播报、新闻播报、客服催收 | **名称**：龙悦 **voice参数**：longyue **语言**：中文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| 有声书、语音助手、聊天数字人 | **名称**：龙媛 **voice参数**：longyuan **语言**：中文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| 会议播报、新闻播报、有声书 | **名称**：龙飞 **voice参数**：longfei **语言**：中文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| 新闻播报、有声书、聊天助手 | **名称**：龙杰力豆 **voice参数**：longjielidou **语言**：中文、英文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| 有声书、导航播报、聊天数字人 | **名称**：龙彤 **voice参数**：longtong **语言**：中文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| 新闻播报、有声书、导航播报 | **名称**：龙祥 **voice参数**：longxiang **语言**：中文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| 语音助手、直播带货、导航播报、客服催收、有声书 | **名称**：Stella **voice参数**：loongstella **语言**：中文、英文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |
| 语音助手、客服催收、新闻播报、导航播报 | **名称**：Bella **voice参数**：loongbella **语言**：中文 | SSML：不支持 Instruct：不支持 时间戳：不支持 |     |

 span.aliyun-docs-icon { color: transparent !important; font-size: 0 !important; } span.aliyun-docs-icon:before { color: black; font-size: 16px; } span.aliyun-docs-icon.icon-size-20:before { font-size: 20px; } span.aliyun-docs-icon.icon-size-22:before { font-size: 22px; } span.aliyun-docs-icon.icon-size-24:before { font-size: 24px; } span.aliyun-docs-icon.icon-size-26:before { font-size: 26px; } span.aliyun-docs-icon.icon-size-28:before { font-size: 28px; }

/\* 当设备显示尺寸宽度过小时，让当做卡片的表格横向单元格改变方向，变成垂直方向显示，类似钉钉文档的分栏效果。 使用时需要为对应的 table 设置 class=column-layout。\*/ @media (max-width: 1590px) { .aliyun-docs-content table.column-layout tr, .aliyun-docs-content table.column-layout td, .aliyun-docs-content table.column-layout th { display: flex !important; flex-direction: column !important; height: auto !important; padding: 0 ; } .aliyun-docs-content table.column-layout colgroup { display: none; } }
