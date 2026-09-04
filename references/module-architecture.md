# 内层模块架构

只规划已有 `game/scripts/` 的边界；游戏主体仍由 Maker 能力生成或实现。

## 依赖方向

```text
Maker / UrhoX 回调
        ↓
Runtime（组装和生命周期）
  ├─ Input → 语义命令 → Application → Domain
  ├─ Application → Persistence / Network / Platform
  └─ Domain → 只读展示数据或事件 → Presentation
```

`Domain` 保存玩法状态与规则，不依赖 UI、渲染、文件、SDK、网络或 Maker 全局对象。`Application` 编排用例，`Runtime` 管理初始化、更新、停止和资源释放。

## 可选模块

只创建能解决当前职责问题的分支：

```text
game/scripts/GameName/
├── Runtime.lua
├── Config/
├── Domain/
│   ├── GameState.lua
│   └── Systems/
├── Application/
├── Input/
├── Presentation/
│   ├── WorldRenderer.lua
│   ├── Visibility.lua
│   ├── Layout.lua
│   └── HudView.lua
├── Persistence/
├── Platform/
├── Performance/                   # 只有实测需要时
└── Debug/

game/scripts/Network/              # 只有多人时
├── Shared.lua
├── Client.lua
└── Server.lua
```

保留已有清晰命名和公共入口，不为了得到漂亮目录移动稳定代码。

## 可读性与状态

- 名称表达业务含义和单位；同一概念在配置、代码、存档和网络消息中使用同一词。
- 每个模块有一个主要职责。大文件按独立规则和测试接缝渐进提取，不按行数机械切碎。
- 重要配置、命令、存档和网络数据用 EmmyLua 标出字段；入口补默认值并完整校验后再修改状态。
- 复杂流程按“校验 → 准备 → 应用 → 发布”组织；生命周期和更新顺序在 `Runtime` 可见。
- 每组关键状态只有一个负责模块和写入口。UI、渲染和音频只读展示数据或事件，不复制规则公式。
- 错误包含操作与对象信息；可恢复错误不能只打印或断言，重试和降级要有明确上限与最终状态。
- 随机源和时间步可注入，确定性输出显式排序；纯规则能脱离 Scene、UI、网络和文件系统测试。

## 手机端 `UI.SafeAreaView`

组件名是 `UI.SafeAreaView`。手机端整个 UI Layer 以它为根，只有 World Layer 使用完整 Viewport：

```lua
UI.SafeAreaView {
    width = "100%",
    height = "100%",
    nativeMenuInset = true,
    children = {
        -- 全部 UI Layer 内容
    },
}
```

- HUD、UI 背景、遮罩、装饰、按钮、摇杆、弹窗和命中区域都在安全视图内。
- `nativeMenuInset = true` 避开 TapTap 胶囊；不要再重复叠加同方向边距。
- World Layer 可铺满屏幕。需要全屏出血的效果归入 World Layer，不放在安全视图外的 UI 节点。
- 世界相机、可见性裁剪和世界坐标使用完整 Viewport；UI 输入使用安全视图坐标。
- 验证刘海、圆角、底部手势区、胶囊、横竖屏和极端长宽比。

## 评审优先级

1. 数据与安全：客户端权威、坏档覆盖、无界网络输入、敏感信息。
2. 正确性：多写入者、绘制期改状态、资源泄漏、无界每帧遍历。
3. 边界：大文件混合职责、循环依赖、重复公式、缺少测试接缝。
4. 清晰度：不影响行为的命名和摆放最后处理。
