# 项目架构宪法

## 项目概述
[简要描述该项目是什么及其主要价值主张。]

## 目标 (Goals)
- [目标 1: 例如，高性能]
- [目标 2: 例如，可扩展性]

## 非目标 (Non-goals)
- [非目标 1: 例如，支持旧版浏览器]
- [非目标 2: 例如，在 v1 中实现复杂的用户角色]

## 技术栈 (Tech Stack)
- **前端/UI:** [例如，React / Vue / Vanilla JS]
- **后端/API:** [例如，Node.js / Python / Go]
- **数据库:** [例如，PostgreSQL / MongoDB]
- **工具:** [例如，Vite / Webpack / Jest]

## 目录结构 (Directory Structure)
```text
/src
  /components  - 可复用的 UI 元素
  /utils       - 辅助函数
  /services    - API 调用和外部集成
  /store       - 状态管理
  /__tests__   - 单元测试和集成测试
```

## 模块边界 (Module Boundaries)
- UI 组件不得包含复杂的业务逻辑。
- Services 处理所有外部数据获取。
- 全局状态仅在 prop drilling 过多时使用。

## 编码标准 (Coding Standards)
- 在适用的地方使用严格类型（例如，TypeScript 严格模式）。
- 在合理的情况下，首选函数式编程范式而不是面向对象。
- 保持函数小巧并专注于单一职责。

## API 标准 (API Standards)
- 使用 RESTful 约定（如果指定，则使用 GraphQL）。
- 标准化响应格式（例如，`{ data, error, meta }`）。

## 数据/数据库标准 (Data / Database Standards)
- 永远不要在客户端直接修改原始数据库记录。
- 所有架构更改都应使用迁移 (migrations)。

## 配置标准 (Configuration Standards)
- 环境变量必须在 `.env.example` 文件中记录。
- 代码库中不得硬编码机密信息。

## 日志标准 (Logging Standards)
- 使用结构化的日志格式（例如，JSON）。
- 日志级别：失败使用 ERROR，预期但已处理的问题使用 WARN，重大状态更改使用 INFO。

## 错误处理标准 (Error Handling Standards)
- 快速且显式地失败 (Fail fast and explicitly)。
- 在边界处（例如，API 路由、顶层 UI 组件）捕获错误并提供用户友好的消息。

## 测试标准 (Testing Standards)
- **单元测试:** 所有实用函数和复杂逻辑都必须进行单元测试。
- **集成测试:** 关键的用户流需要集成测试。
- **覆盖率目标:** [例如，80%]

## 安全标准 (Security Standards)
- 清理所有用户输入。
- 在后端验证数据，永远不要信任客户端。

## 性能指南 (Performance Guidelines)
- 延迟加载非关键资产。
- 最小化主线程阻塞操作。

## 依赖项策略 (Dependency Policy)
- 仅在绝对必要时才添加新依赖项。
- 优先选择标准库或维护良好、体积小的包。

## AI 协作规则 (AI Collaboration Rules)
### Codex 可以做什么 (What Codex May Do)
- 编写代码以实现 `tasklist.md` 中定义的具体任务。
- 为他们的代码编写并执行测试。
- **仅在** 分配任务的边界内重构代码。

### Codex 不可以做什么 (What Codex Must Not Do)
- 修改此 `architecture.md` 文件。
- 更改全局状态管理范式。
- 未经批准引入新框架、语言或主要依赖项。
- 执行当前未分配的任务。

## 架构变更策略 (Architecture Change Policy)
任何明显偏离本文档的更改都需要进行正式的讨论和记录。

## ADR 策略 (ADR Policy)
在修改此架构之前，Planner 必须使用提供的模板在 `docs/ai/adr/` 中创建架构决策记录 (ADR)。只有在 ADR 获得批准后，才能更新此文件。
