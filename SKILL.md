---
name: taptap-maker-kit
description: 仅用于已绑定的 TapTap Maker 项目，或用户明确说明当前或目标项目是 TapTap Maker 时，规划双层 Git、game submodule、Maker API、云存储、Lua 模块、手机安全区、性能、商店发布素材、预览与测试二维码。不要用于普通 Lua、Urho3D、Unity、Roblox、浏览器游戏或其他非 Maker 项目；未确认项目类型前不得加载本 skill 的 references。
---

# TapTap Maker 开发工具包

## 编辑器兼容

本目录的 `SKILL.md` 和 `references/` 是唯一内容源，使用通用 Agent Skills 格式，不依赖 OpenAI、Codex、Claude、Cursor 或其他单一编辑器的专属元数据。

由安装器把同一目录链接或复制到当前编辑器支持的 skill 发现目录，例如 `.codex/skills/`、`.cursor/skills/`、`.claude/skills/` 或 `.gemini/skills/`。不要为不同编辑器维护内容副本；某编辑器不支持 Agent Skills 或 Maker MCP 时，按其官方接入方式处理，不编造兼容层。

## 启用门槛

读取任何 reference 或扫描项目文档前，只做一次轻量确认。满足其一才继续：

- 当前根或 `game/` 同时存在 `.project/settings.json`，且对应 `AGENTS.md` 包含 TapTap Maker 托管策略；
- Maker 状态工具明确返回当前目录是已绑定项目；
- 外层 `.gitmodules` 明确把 `game/` 指向 TapTap Maker 远端，即使 submodule 尚未检出；
- 用户明确说明当前或目标项目是 TapTap Maker，包括新建、初始化或迁移任务。

否则立即停止使用本 skill，不读取仓库里的其他 Markdown，也不把这里的目录、Lua、云存储或 UI 规则套到当前项目。

## 按需读取

确认是 Maker 项目后，只读取当前任务对应的文件：

- 初始化、开发、预览、推送或二维码：[Maker 生命周期](references/maker-workflow.md)
- 上架、商店资料、发布素材、图标、宣传图、截图或实机录屏：[发布素材](references/publish-assets.md)
- 外层目录、素材流或 Git submodule：[双层目录](references/project-tree.md)
- Maker API、示例、`clientCloud` 或 `serverCloud`：[API 与存储](references/taptap-api-priority.md)
- Lua 模块、状态边界、代码可读性、手机 UI 或玩家可见文案：[模块架构](references/module-architecture.md)
- 卡顿、大地图、对象更新或屏幕内渲染：[性能](references/performance.md)
- 用户要求完整架构方案时：[输出模板](references/plan-template.md)，再按涉及范围读取上述文件

不要因为一次普通代码修改就加载全部 references。

## 核心边界

- 外层是产品资料 Git 仓库；Maker CLI 生成的 `game/` 是独立 Git 仓库，并由外层作为 submodule 引用。
- 游戏主体由 Maker 自带能力生成和维护；本 skill 只规划外层资料、模块和流程。只有用户明确要求实施时才改代码或执行外部操作。
- Maker API 先查当前项目的托管规则、MCP、引擎文档、类型声明和相关示例；不凭其他引擎经验猜方法或事件。
- 不新增人类可读接口说明文件。机器契约只在已有实际消费者时保留。
- 单机存档和单机异步全服榜使用 `clientCloud`；实时多人及服务端权威数据使用 `serverCloud`，同一数据不得双写。
- 手机端整个 UI Layer 位于 `UI.SafeAreaView` 内并避开 TapTap 胶囊；只有 World Layer 可以铺满完整屏幕。
- 玩家可见 UI 必须使用玩家视角、符合当前游戏世界和玩法的语言，不得出现研发、策划、配置、调试、接口或占位提示等内部工作语气。技术细节只进入日志或与正式 UI 隔离的开发调试界面。
- 性能优化必须先有可复现场景和基线。屏幕外默认不绘制，但客户端可见性不能决定服务端权威逻辑。
- 发布预览只在 `game/` 上下文执行；Maker 发布流程负责同步、合并并推送内层仓库。预览成功后只向用户返回可点击的预览链接，不主动打开预览页、浏览器或其他应用；只有用户明确要求打开时才执行打开操作。
- 测试二维码不是发布预览的默认后续步骤。只有用户明确要求生成测试二维码时，才在 `game/` 上下文执行；不得因预览、构建、提交或推送成功而主动生成。
- TapTap 商店发布素材位于外层 `publish/`；小游戏专用物料限制优先于更宽松的通用商店限制。

## 输出原则

只输出当前任务需要的现状证据、目标边界、分阶段变更、验证和风险。未知 Maker 行为标为“待查证”；不要用完整目录树或通用检查表填充答案。
