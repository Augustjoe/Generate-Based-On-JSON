# 当前项目状态

*此文件是项目上下文的轻量级快照，**仅由** Planner (GPT-5.5) 在成功审查后更新。旨在最大限度地减少新上下文窗口的 token 消耗。*

## 当前摘要 (Current Summary)
项目当前是一个 Vue 3 + TypeScript + Vite 的后台管理类单页应用雏形，目标正在收敛为“给前端开发者使用的低代码模板管理系统”。现有实现已经包含登录守卫、布局框架、菜单、工作台、仪表盘、表单示例、ProTable/SearchForm/CustomTable 等配置驱动组件，以及 CodeMirror 代码编辑器基础组件。

目前还不是完整模板管理系统：缺少模板列表、模板详情、模板保存/导入导出、配置 schema、真实持久化和正式模板编辑流程。后续应先巩固“模板配置模型”和“本地模板管理闭环”，再考虑后端或复杂功能。

## 已完成工作 (Completed Work)
- Vue 3 + Vite + TypeScript 项目基础已建立。
- 已接入 Naive UI provider、Pinia、Vue Router。
- 已实现 mock 登录 store、localStorage 恢复、logout，以及路由守卫。
- 已实现后台布局、菜单配置、工作台、首页图表、基本表单、基本表格和 ProTable 示例页面。
- 已有配置驱动的 Form、SearchFrom、CustomTable、ProTable、FormEditorButton、CardCodeEditor 等组件。
- 已有动态解析 Naive UI 组件的工具 `src/utils/dynamicComponent.ts`。
- 已有 Vitest 测试覆盖 auth store、router guard、app settings store 和 ProTable 基础行为。
- AI 协作文档在 Task 000 中完成项目上下文实装。
- Task 001 已完成：登录页支持按 Enter 键触发登录，并添加 loading 防重复提交测试。

## 当前技术栈 (Current Tech Stack)
- Vue 3、TypeScript、TSX、Vite。
- Naive UI、@vicons 图标包。
- Pinia、Vue Router。
- CodeMirror / vue-codemirror。
- ECharts。
- Vitest、@vue/test-utils、jsdom。
- ESLint、Prettier、vue-tsc。
- Less / CSS。
- 当前无真实后端、无数据库。

## 当前架构决策 (Current Architecture Decisions)
- 保留现有 Vue 3 + TypeScript + Vite 技术栈，不新增框架。
- 保留 Naive UI 作为主 UI 组件库。
- 保留 Pinia 作为全局状态管理。
- 低代码能力优先沿用现有“配置对象驱动组件渲染”的方向。
- 当前阶段以后端无关、本地 mock 和前端组件闭环为主。
- 暂无正式 ADR；需要引入模板 schema、后端、数据库、插件机制或安全执行模型时再新增 ADR。

## 活动任务 (Active Task)
**Task ID:** Task 002  
**Goal:** 新增统一右侧配置面板基础能力。  
**Assigned to:** Codex

## 已知问题 (Known Issues)
- `README.md` 仍是 Vite 模板默认说明，没有描述当前项目目标、启动方式和开发约束；该事项已移入 Backlog。
- 仓库根目录存在多个 `tmp-*` 调试脚本、截图和 JSON 文件，是否应保留尚未明确。
- mock 登录只适合本地演示，不具备真实安全性。
- 低代码配置类型较分散，`FormItem`、按钮项、表格配置等全局类型来源需要进一步梳理。
- 当前模板管理领域对象尚未建立，缺少“模板”的列表、创建、编辑、预览、保存和导入导出流程。
- 部分页面仍偏后台模板示例内容，尚未完全服务于模板管理系统目标。

## 已知风险 (Known Risks)
- 如果不先定义最小模板配置模型，后续功能容易变成页面示例堆叠。
- 动态渲染函数和未来模板导入能力存在安全风险，不能直接执行不可信代码。
- `src/utils/dynamicComponent.ts` 通过 Vite glob 解析 Naive UI 内部路径，依赖包结构变化可能影响稳定性。
- 当前测试主要覆盖 store/router/ProTable 基础行为，低代码配置解析和编辑流程覆盖不足。
- `npm run lint` 会自动修复文件，Executor 使用前需要注意工作区已有改动。

## 测试状态 (Test Status)
- **整体健康状况:** Passing (通过)
- **最近运行命令:** `npm run test:unit -- --run`
- **最近结果:** 4 个测试文件通过，12 个测试通过。
- **备注:** 最近一次测试在 Task 001 审查期间运行通过。
- **覆盖率:** 未配置覆盖率统计。

## 重要文件 (Important Files)
- `src/main.ts` - 应用入口。
- `src/App.vue` - Naive UI provider 和路由视图。
- `src/router/index.ts` - 路由实例与登录守卫。
- `src/views/router.tsx` - 页面路由配置。
- `src/views/menu.tsx` - 菜单配置。
- `src/stores/authStore.ts` - mock 登录状态。
- `src/stores/appSettings.ts` - 菜单位置、主题、编辑模式。
- `src/components/Form.tsx` - 配置驱动表单核心组件。
- `src/components/ProTable.tsx` - 搜索表单 + 表格组合组件。
- `src/components/CustomTable.tsx` - 表格渲染与操作组件。
- `src/components/CardCodeEditor.tsx` - CodeMirror 编辑器卡片。
- `src/utils/dynamicComponent.ts` - Naive UI 动态组件解析。
- `src/__tests__/` - 当前单元测试。

## 推荐的下一个任务 (Next Recommended Task)
- Task 002

## 给 GPT-5.5 的上下文笔记 (Context Notes for Planner/Reviewer)
- 优先让后续任务保持小步推进：先完成统一右侧配置面板基础能力，再逐步接入普通表单页和 ProTable / TableView。
- 不要在没有 ADR 的情况下规划真实后端、数据库、多用户权限或插件执行沙箱。
- 评审时重点看 Executor 是否只完成当前 Task，是否追加 execution_log，是否运行相关测试。

## 给 Codex 的上下文笔记 (Context Notes for Executor)
- 每次任务开始前阅读 `architecture.md`、`tasklist.md`、`current_state.md`、`review_report.md`。
- 不要修改 `architecture.md`、`tasklist.md`、`current_state.md`、`review_report.md`，除非用户明确切换你为 Planner/Reviewer 或直接要求。
- 修改代码后至少运行相关测试；通用变更优先运行 `npm run test:unit -- --run`。
- 不要新增依赖，除非 Task 明确批准。
- `execution_log.md` 只能追加，不能改历史。
- 当前分配任务是 Task 002；不要提前执行 Task 003 或 Task 004。
