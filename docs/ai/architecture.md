# 项目架构宪法

## 项目概述
Generate-Based-On-JSON 是一个面向前端开发者的低代码模板管理系统雏形。当前代码库已经具备 Vue 3 单页应用基础、登录守卫、后台布局、工作台、仪表盘、JSON/配置驱动的表单与表格组件，以及用于编辑配置的基础 UI。

项目的核心价值是：让前端开发者用结构化配置快速组合常见后台页面模板，并在后续迭代中沉淀为可管理、可预览、可复用的模板资产。

## 目标 (Goals)
- 提供面向前端开发者的低代码模板管理能力，优先覆盖后台管理系统中常见的表单、搜索表格、ProTable、工作台等模板。
- 保持配置驱动的实现方式，让模板可以通过 JSON/对象配置描述组件、字段、表格列、按钮和基础交互。
- 保持工程轻量，基于现有 Vue 3 + TypeScript + Vite 技术栈持续演进。
- 保持组件边界清晰，让页面示例、低代码配置编辑能力、通用组件、状态管理可以分别迭代。
- 为核心配置解析、登录状态、路由守卫和关键组件补充可运行测试。

## 非目标 (Non-goals)
- 当前阶段不实现真实后端、数据库、在线多用户协作或复杂权限体系。
- 当前阶段不引入新的前端框架、后端框架、ORM 或大型状态管理替代方案。
- 当前阶段不追求完整商业化模板市场、插件市场或远程发布链路。
- 当前阶段不支持旧版浏览器；以现代浏览器和 Vite 默认目标为准。
- 当前阶段不把 mock 登录当作真实鉴权方案。

## 技术栈 (Tech Stack)
- **前端/UI:** Vue 3、TypeScript、TSX、Naive UI、Vue Router、Pinia。
- **低代码/编辑能力:** 配置驱动组件、Vue TSX 渲染函数、CodeMirror、动态解析 Naive UI 组件。
- **数据可视化:** ECharts。
- **构建工具:** Vite、vue-tsc、TypeScript project references。
- **测试工具:** Vitest、@vue/test-utils、jsdom。
- **代码质量:** ESLint、Prettier。
- **样式:** CSS、Less。
- **后端/API:** 暂无真实后端；现有数据请求均为前端 mock 或组件入参。
- **数据库:** 暂无。

## 目录结构 (Directory Structure)
```text
/
  docs/ai/                 - Planner / Executor / Reviewer 协作文档
  src/
    main.ts                - Vue 应用入口，安装 Pinia 与 Router
    App.vue                - Naive UI 全局 provider 与 RouterView
    router/                - Vue Router 实例与登录守卫
    stores/                - Pinia store：登录、应用设置、抽屉、编辑模式
    components/            - 通用低代码组件与基础 UI 组件
    views/                 - 页面级模块：布局、登录、首页、工作台、表格、表单
    utils/                 - 动态组件解析、图标映射等工具
    assets/                - 全局样式、图片资源、渲染函数提取工具
    __tests__/             - Vitest 单元测试
  vite.config.ts           - Vite、Vue、自动导入和 Naive UI 组件解析配置
  vitest.config.ts         - Vitest 配置
  eslint.config.js         - ESLint 配置
```

## 模块边界 (Module Boundaries)
- `src/components/` 放可复用组件，不应直接绑定某个页面的业务数据；复杂示例数据应放在 `src/views/`。
- `src/views/` 放页面编排和演示配置，可以组合组件、mock 请求和页面级状态。
- `src/stores/` 只存跨页面共享状态，例如登录、主题、菜单位置、编辑模式、全局抽屉状态。
- `src/router/` 只负责路由表接入和导航守卫，不承载业务 UI。
- `src/utils/` 放纯工具或低副作用工具；动态组件解析等共享逻辑优先放这里。
- `src/assets/` 可放样式、图片和与渲染配置相关的辅助工具；不要把业务页面逻辑继续堆入 assets。
- 低代码配置对象应尽量保持可序列化；必须使用函数渲染时，应明确通过专门工具处理，例如现有 `render-fn-extractor.ts`。

## 编码标准 (Coding Standards)
- 使用 TypeScript；新增代码应尽量补充明确类型，避免扩大 `any` 的使用范围。
- 现有项目允许 Vue TSX，新增页面和组件应保持当前风格一致，不强制迁移为 `.vue`。
- 组件 props、emits 和可复用类型要显式声明；共享类型优先沉淀为稳定的类型定义。
- 保持函数小而聚焦；配置转换、数据请求、渲染分支不要混在同一个大型函数中继续膨胀。
- 路径导入优先使用 `@/` alias；同目录内可使用相对路径。
- 格式遵循现有 Prettier：无分号、单引号、`printWidth: 100`。
- 不做无关重构；每个 Executor 任务只修改任务范围内的文件。

## UI / 交互标准 (UI Standards)
- 继续使用 Naive UI 作为主要组件库，优先组合现有组件，不自造通用基础控件。
- 后台工具型页面应保持信息密度、可扫描性和稳定布局，避免过度营销化或装饰化。
- 低代码编辑入口应清楚区分普通预览模式和编辑模式，避免编辑控件影响普通使用。
- 表单、表格、按钮等配置项应尽量与 Naive UI 原有 props 兼容，降低学习成本。

## 数据与 API 标准 (Data / API Standards)
- 当前无后端 API。需要异步数据时，组件通过 `request` 这类函数入参解耦数据来源。
- mock 数据仅用于演示和测试，不应伪装为真实服务端能力。
- 未来接入 API 时，应在边界层统一处理请求、错误、分页和返回结构；不要让通用组件直接依赖具体接口 URL。
- 未来接入持久化时，模板配置应优先定义稳定 schema，再考虑导入、导出和版本迁移。

## 状态管理标准 (State Management)
- 继续使用 Pinia。
- 只把跨页面共享且确实需要全局访问的状态放入 store。
- 页面局部表单数据、表格数据、编辑器临时内容优先放在页面或组件本地。
- 登录 store 当前是 mock 登录与 localStorage 持久化，不能作为生产鉴权依据。

## 配置标准 (Configuration Standards)
- 不硬编码机密信息、真实 token、私有 API 地址。
- 新增环境变量必须同步记录到 `.env.example`；当前项目尚未建立 `.env.example`。
- Vite、Vitest、TypeScript、ESLint 配置变更应服务于明确任务，不做顺手大改。

## 错误处理标准 (Error Handling Standards)
- 组件边界应显式处理加载失败、空数据和非法配置。
- 用户可见错误优先使用 Naive UI message/notification；开发诊断日志仅在必要时保留。
- 动态组件解析失败时应保留可诊断信息，但不能导致整个页面不可恢复崩溃。

## 测试标准 (Testing Standards)
- 修改代码后必须运行相关测试；通用组件或 store 修改至少运行 `npm run test:unit -- --run`。
- 涉及类型或构建链路的修改应运行 `npm run build` 或至少 `npm run type-check`。
- 新增核心工具函数、store、路由守卫、配置解析逻辑必须补充 Vitest 测试。
- 低代码组件的测试应优先覆盖配置输入、事件输出、编辑模式、异常配置和空数据状态。
- 当前没有覆盖率门槛；在测试基础稳定前，不设置硬性百分比。

## 安全标准 (Security Standards)
- 不在仓库中提交真实账号、密码、token 或私有服务地址。
- localStorage 中的 mock token 仅用于本地演示，不可扩展为生产安全模型。
- 将来支持模板导入或执行用户提供的渲染函数时，必须先做安全评估；不要直接执行不可信代码。
- 渲染用户输入内容时，应避免 `v-html` 或等价的未清理 HTML 注入。

## 性能指南 (Performance Guidelines)
- 保持页面级路由懒加载；大型图表、编辑器和低频功能应避免进入首屏关键路径。
- 动态组件解析应使用缓存，延续现有 `componentCache` 思路。
- 表格组件应保持分页和按需加载能力；大数据量不要一次性渲染到前端。
- 避免在渲染函数中进行昂贵计算；复杂配置转换应提前计算或缓存。

## 依赖项策略 (Dependency Policy)
- 不在没有任务批准的情况下新增外部依赖。
- 优先使用当前已有依赖：Vue、Naive UI、Pinia、Vue Router、CodeMirror、ECharts、Vitest。
- 新依赖必须说明用途、替代方案、体积/维护风险，并由 Planner 通过任务或 ADR 批准。

## AI 协作规则 (AI Collaboration Rules)
### Planner / Reviewer 可以做什么
- 维护 `docs/ai/architecture.md`、`docs/ai/tasklist.md`、`docs/ai/current_state.md`、`docs/ai/review_report.md`。
- 将需求拆成小而可执行的 Task。
- 审查 Executor 的执行日志、git diff 和测试结果，并给出 PASS / NEEDS_FIX / REJECT。

### Executor (Codex) 可以做什么
- 只执行 `docs/ai/tasklist.md` 中明确分配给 Codex 的当前 Task。
- 在任务范围内修改代码、补充测试、运行测试，并向 `docs/ai/execution_log.md` 追加执行日志。
- 在不改变架构的前提下做局部、必要、可解释的整理。

### Executor (Codex) 不可以做什么
- 未经明确要求修改 `docs/ai/architecture.md`、`docs/ai/tasklist.md`、`docs/ai/current_state.md` 或 `docs/ai/review_report.md`。
- 修改或重写 `docs/ai/execution_log.md` 的历史内容；只能追加。
- 未经批准引入新框架、语言、主要依赖或真实后端。
- 执行未分配任务、跨多个大功能一次性开发、做无关重构。

## 架构变更策略 (Architecture Change Policy)
明显偏离本文档的更改需要先由 Planner 创建 ADR，并在任务中明确授权后再执行。轻量文档初始化和基于现有事实的保守补充不视为重大架构变更。

## ADR 策略 (ADR Policy)
- ADR 存放在 `docs/ai/adr/`。
- 新增后端、数据库、模板 schema 版本策略、插件机制、安全执行模型、状态管理替换等决策必须先写 ADR。
- ADR 使用 `docs/ai/adr/ADR-template.md`。
