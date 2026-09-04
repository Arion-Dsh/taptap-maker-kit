# Maker 生命周期

固定流程：游戏设计 → Maker 初始化 → 开发 → 发布预览 → 测试二维码。

## 游戏设计

在外层仓库保存设计、原始素材和验收目标。不要手工搭建 Maker 项目骨架，也不要在 API 未确认前写实现。

## Maker 初始化

安装和初始化以 [TapTap Maker 本地开发文档](https://maker.taptap.cn/docs/local-development) 为准：

1. Maker MCP、命令或 skills 缺失时执行：

   ```bash
   npx -y @taptap/maker install --ide codex,cursor,claude
   ```

   该参数安装到列出的编辑器。使用其他编辑器时，只添加当前 Maker CLI 文档明确支持的 `--ide` 标识，不猜测名称。

2. 必要时重启或刷新客户端。
3. 将外层的空白 `game/` 作为项目目录，在其中执行：

   ```bash
   npx -y @taptap/maker init
   ```

4. 验证 `game/AGENTS.md`、`.project/`、`scripts/`、`assets/`、Git 元数据和 Maker 绑定状态。
5. 按 [双层目录的 Git 边界](project-tree.md) 把内层仓库登记为外层 submodule。

## 开发

进入 `game/`，读取其 `AGENTS.md` 和当前任务所需的 Maker 文档。按 `examples/api-index.md` 选择相关示例；示例可用于实现方式，不覆盖托管规则、MCP 或当前文档。

玩法代码、测试和运行时资源留在内层仓库；外层只维护设计、原始素材、加工工具和 submodule 指针。普通代码检查不触发远端预览。

## 发布预览

仅在用户明确要求构建、预览、提交或推送时，从 `game/` 调用 `maker_build_current_directory` 并跟随 `next_action`。由 Maker 流程同步、合并并推送内层仓库，不自行假定具体 Git 步骤。

冲突、认证失败或远端拒绝时保留证据并停止，不丢弃改动或强推。内层推送成功后才更新外层 submodule 指针。外层 `publish/` 只是商店宣发素材目录。

## 测试二维码

预览成功后，在 `game/` 上下文调用 `generate_test_qrcode`。使用工具返回的二维码及构建信息，不在外层自行生成。
