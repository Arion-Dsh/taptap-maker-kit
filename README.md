# TapTap 制造开发工具包

面向 TapTap 制造游戏项目的 Agent Skill，提供项目目录、模块边界、TapTap 制造 API 使用、云存储、移动端适配、性能优化以及开发发布流程约束。

## 项目介绍

`taptap-maker-kit` 是一套可供多种 AI 编辑器读取的 TapTap 制造项目开发规则。它不替代 TapTap 制造创建游戏主体，而是帮助 AI 在真实项目中保持一致的工程边界：先确认项目类型，再按任务读取必要规则，并优先依据当前 TapTap 制造项目的托管说明、API 文档、类型声明和示例开展工作。

工具包围绕“游戏设计 → TapTap 制造初始化 → 开发 → 预览发布”的主流程组织；测试二维码仅在用户明确要求时按需生成。同时支持产品文档和原生素材位于外层仓库、TapTap 制造生成的 `game/` 作为独立 Git submodule 管理的项目结构。

## 示例项目

| 游戏 | 玩法定位 | 工程参考重点 |
| --- | --- | --- |
| [鸡不可失](https://www.taptap.cn/app/919169) | 温馨治愈的养鸡经营游戏 | 产品资料与游戏工程分离、TapTap 制造 API、`clientCloud`、移动端 UI 与性能优化 |
| [鲨鱼！放开我的鱼](https://www.taptap.cn/app/923487) | 多人在线、轻松又紧张的纸艺风钓鱼经营游戏 | 客户端与服务端职责、`serverCloud`、多人状态同步、世界对象分级更新与屏幕内渲染 |

## 能做什么

- 规划产品资料仓库与 `game/` 内层仓库的边界
- 约束 TapTap 制造 API 的查证顺序，避免臆造接口
- 区分 `clientCloud` 与 `serverCloud` 的使用场景
- 规划清晰、可维护的 Lua 模块结构
- 约束移动端 UI 位于 `UI.SafeAreaView` 内
- 约束玩家可见文案使用游戏内语境，不暴露研发、策划、配置或调试语气
- 优化大地图、对象更新和屏幕内渲染
- 整理和验收 TapTap 商店发布素材的尺寸、体积、格式和数量
- 规范设计、初始化、开发、预览发布流程；预览成功后只返回链接，不主动打开页面，并约束测试二维码仅按用户明确要求生成

本 Skill 不负责替代 TapTap 制造生成游戏主体，也不会对普通 Lua、Urho3D、Unity、Roblox 或浏览器游戏项目自动套用这些规则。

## 安装

### 通用 Agent Skills

使用通用的 [Skills CLI](https://www.skills.sh/docs/cli) 安装。它会识别仓库中的 `SKILL.md`，并让你选择当前环境支持的 AI 编辑器。

#### 当前项目自用

在目标项目根目录执行；这是默认范围：

```bash
npx skills@latest add Arion-Dsh/taptap-maker-kit
```

#### 当前用户公用

添加 `-g`，安装后当前用户的所有项目都可以使用：

```bash
npx skills@latest add Arion-Dsh/taptap-maker-kit -g
```

指定编辑器并跳过交互确认：

```bash
npx skills@latest add Arion-Dsh/taptap-maker-kit -a codex -y
```

更新已安装的版本：

```bash
npx skills@latest update taptap-maker-kit
```

Skills CLI 默认安装到当前项目；`-g` 切换为用户级安装。实际目录、链接或复制方式由 CLI 根据目标编辑器和用户选择处理，无需本仓库维护专用安装器。

### Claude Code 插件

终端安装（命令是 `claude plugin`，不是 `claude plugins`）：

```bash
claude plugin marketplace add https://github.com/Arion-Dsh/taptap-maker-kit.git
claude plugin install taptap-maker-kit@arion-dsh
```

也可以在 Claude Code 会话中执行对应的交互式命令：

```text
/plugin marketplace add https://github.com/Arion-Dsh/taptap-maker-kit.git
/plugin install taptap-maker-kit@arion-dsh
```

安装后可通过 `/taptap-maker-kit:taptap-maker-kit` 显式调用。若当前会话尚未加载插件，执行 `/reload-plugins` 或重新启动 Claude Code。

## 使用

在已绑定的 TapTap 制造项目中直接描述任务；支持显式调用 Skill 的编辑器也可以使用 `taptap-maker-kit` 名称调用。

示例：

```text
使用 taptap-maker-kit，为这个 TapTap 制造项目规划模块结构和云存储边界。
```

Skill 会先轻量确认项目类型，再按任务读取必要的参考文件。非 TapTap 制造项目不会加载完整规则集。

## 目录

```text
taptap-maker-kit/
├── .claude-plugin/
│   ├── marketplace.json
│   └── plugin.json
├── LICENSE
├── README.md
├── SKILL.md
└── references/
    ├── maker-workflow.md
    ├── module-architecture.md
    ├── performance.md
    ├── plan-template.md
    ├── publish-assets.md
    ├── project-tree.md
    └── taptap-api-priority.md
```

- `SKILL.md`：启用条件、按需路由和核心边界
- `references/`：仅在相关任务中读取的详细规则
- `.claude-plugin/`：Claude Code 插件与 marketplace 元数据，不复制 Skill 内容

## TapTap 制造本地开发

安装、初始化和本地开发以 [TapTap 制造本地开发文档](https://maker.taptap.cn/docs/local-development) 为准。TapTap 制造能力未安装时，Skill 会优先使用官方命令：

```bash
npx -y @taptap/maker install --ide codex,cursor,claude
```

其他编辑器仅使用 TapTap 制造官方支持的 `--ide` 标识，不自行假设兼容参数。

## 贡献

修改规则时保持 `SKILL.md` 精简，将条件性细节放入对应 reference，并避免在多个文件重复同一约束。提交前至少检查 YAML frontmatter、相对链接、旧名称残留，以及各编辑器元数据是否仍指向同一份 Skill 内容。

## License

本项目采用 [MIT License](LICENSE)。

本项目由个人维护，非 TapTap 制造官方项目。
