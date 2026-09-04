# 双层目录

按实际需要裁剪；不要为了匹配示例创建空目录或重复文档。

```text
product-name-maker/
├── .git/
├── .gitmodules                    # game 的无凭据远端与路径
├── README.md
├── LICENSE
├── .gitignore
├── docs/
│   ├── GAME_DESIGN.md
│   ├── TECHNICAL_DESIGN.md        # 架构、Maker API、存储、性能与测试
│   ├── ART_DIRECTION.md
│   ├── ASSET_PIPELINE.md
│   └── ROADMAP.md
├── contracts/                     # 可选；只放有消费者的机器契约
├── source-assets/                 # 原图、原音频、原视频、提示词与授权
├── tools/                         # 可选；可重复的素材加工或校验工具
├── game/                          # Maker CLI 生成的 Git submodule
│   ├── AGENTS.md
│   ├── .project/
│   ├── engine-docs/                 # Maker 托管资料
│   ├── examples/                    # 按索引选用，不纳入业务代码评审
│   ├── urhox-libs/                  # Maker 高层封装
│   ├── scripts/
│   ├── assets/                    # 处理后的运行时资源
│   └── tests/
└── publish/                       # 商店图、视频和文案；不是预览工作目录
```

## 事实源

| 内容 | 事实源 | 交付位置 |
|---|---|---|
| 设计与技术决策 | `docs/` | `game/README.md` 仅保留运行入口或链接 |
| 原始素材 | `source-assets/` | 处理后进入 `game/assets/` 或 `publish/` |
| 机器契约 | `contracts/` | 由实际校验器或代码消费 |
| 玩法 Lua | `game/scripts/` | 外层不保留镜像 |

没有自动消费者时不创建 `contracts/`；不要改为新增一份人类可读接口说明。没有素材加工工具或宣发物时，省略 `tools/` 或 `publish/`。

## Git 边界

- 外层只跟踪 `.gitmodules` 和 `game/` 的 submodule 指针，不直接跟踪内层文件。
- `.gitmodules` 不得包含凭据；无法取得安全 URL 时暂停登记 submodule。
- 内层推送成功后再更新外层指针，两次提交可独立回滚。
- 外层 `.gitignore` 不得忽略已经登记的 `game/` submodule。
