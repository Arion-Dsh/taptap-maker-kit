# TapTap Maker Kit

面向 TapTap Maker 游戏项目的 Agent Skill，提供项目目录、模块边界、Maker API 使用、云存储、移动端适配、性能优化以及开发发布流程约束。

这是社区维护项目，不是 TapTap 官方产品。

## 项目介绍

`taptap-maker-kit` 是一套可供多种 AI 编辑器读取的 TapTap Maker 项目开发规则。它不替代 Maker 创建游戏主体，而是帮助 AI 在真实项目中保持一致的工程边界：先确认项目类型，再按任务读取必要规则，并优先依据当前 Maker 项目的托管说明、API 文档、类型声明和示例开展工作。

工具包围绕“游戏设计 → Maker 初始化 → 开发 → 预览发布 → 测试二维码”的完整流程组织，同时支持产品文档和原生素材位于外层仓库、Maker 生成的 `game/` 作为独立 Git submodule 管理的项目结构。

## 示例项目

| 游戏 | 玩法定位 | 工程参考重点 |
| --- | --- | --- |
| [鸡不可失](https://www.taptap.cn/app/919169) | 温馨治愈的养鸡经营游戏 | 产品资料与游戏工程分离、Maker API、`clientCloud`、移动端 UI 与性能优化 |
| [鲨鱼！放开我的鱼](https://www.taptap.cn/app/923487) | 多人在线、轻松又紧张的纸艺风钓鱼经营游戏 | 客户端与服务端职责、`serverCloud`、多人状态同步、世界对象分级更新与屏幕内渲染 |

## 能做什么

- 规划产品资料仓库与 `game/` 内层仓库的边界
- 约束 TapTap Maker API 的查证顺序，避免臆造接口
- 区分 `clientCloud` 与 `serverCloud` 的使用场景
- 规划清晰、可维护的 Lua 模块结构
- 约束移动端 UI 位于 `UI.SafeAreaView` 内
- 优化大地图、对象更新和屏幕内渲染
- 规范设计、初始化、开发、预览发布和测试二维码流程

本 Skill 不负责替代 TapTap Maker 生成游戏主体，也不会对普通 Lua、Urho3D、Unity、Roblox 或浏览器游戏项目自动套用这些规则。

## 安装

Windows、macOS 和 Linux 使用相同的安装命令，并可选择以下范围。

### 当前用户公用

安装到当前用户的编辑器 skills 目录，之后该用户的所有项目都可以发现：

```bash
npx -y --package=git+https://github.com/Arion-Dsh/taptap-maker-kit.git -- taptap-maker-kit
```

这是默认范围，等同于显式指定 `--scope user`。

### 当前项目自用

在目标项目根目录执行，只安装到该项目的编辑器 skills 目录：

```bash
npx -y --package=git+https://github.com/Arion-Dsh/taptap-maker-kit.git -- taptap-maker-kit --scope project --target .
```

也可以通过 `--target` 指定其他项目目录，或用 `--editor` 只安装到一个编辑器：

```bash
npx -y --package=git+https://github.com/Arion-Dsh/taptap-maker-kit.git -- taptap-maker-kit --editor codex
```

安装器会把 Skill 复制到相应目录，不依赖 Bash 或符号链接，需要 Node.js 18 或更高版本。默认不会覆盖同名目录；更新已有安装时显式追加 `--force`，追加 `--help` 可查看全部参数。

常见的项目级目录包括：

```text
.codex/skills/taptap-maker-kit/
.cursor/skills/taptap-maker-kit/
.claude/skills/taptap-maker-kit/
.gemini/skills/taptap-maker-kit/
```

不同编辑器的发现目录和 Agent Skills 支持情况可能变化，请以对应编辑器的当前文档为准。

## 使用

在已绑定的 TapTap Maker 项目中直接描述任务；支持显式调用 Skill 的编辑器也可以使用 `taptap-maker-kit` 名称调用。

示例：

```text
使用 taptap-maker-kit，为这个 TapTap Maker 项目规划模块结构和云存储边界。
```

Skill 会先轻量确认项目类型，再按任务读取必要的参考文件。非 TapTap Maker 项目不会加载完整规则集。

## 目录

```text
taptap-maker-kit/
├── LICENSE
├── README.md
├── SKILL.md
├── package.json
├── scripts/
│   └── install.mjs
└── references/
    ├── maker-workflow.md
    ├── module-architecture.md
    ├── performance.md
    ├── plan-template.md
    ├── project-tree.md
    └── taptap-api-priority.md
```

- `SKILL.md`：启用条件、按需路由和核心边界
- `references/`：仅在相关任务中读取的详细规则

## TapTap Maker 本地开发

安装、初始化和本地开发以 [TapTap Maker 本地开发文档](https://maker.taptap.cn/docs/local-development) 为准。Maker 能力未安装时，Skill 会优先使用官方命令：

```bash
npx -y @taptap/maker install --ide codex,cursor,claude
```

其他编辑器仅使用 TapTap Maker 官方支持的 `--ide` 标识，不自行假设兼容参数。

## 贡献

修改规则时保持 `SKILL.md` 精简，将条件性细节放入对应 reference，并避免在多个文件重复同一约束。提交前至少检查 YAML frontmatter、相对链接、旧名称残留和编辑器专属内容。

## License

本项目采用 [MIT License](LICENSE)。
