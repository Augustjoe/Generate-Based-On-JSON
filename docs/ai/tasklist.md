# 项目任务路线图 (Tasklist Roadmap)

此文件由 Planner (GPT-5.5) 维护。Executor (Codex) 只能阅读此文件以了解其当前任务。

## 工作流规则 (Workflow)
- Planner (GPT-5.5) 负责规划、拆分任务、维护 `architecture.md`、`tasklist.md`、`current_state.md`、`review_report.md`。
- Executor (Codex) 只执行当前分配的一个 Task，并在完成后向 `docs/ai/execution_log.md` 追加执行日志。
- Reviewer (GPT-5.5) 审查 Executor 的执行日志、git diff 和测试结果，给出 PASS / NEEDS_FIX / REJECT。
- 只有 Reviewer 给出 PASS 后，Planner 才推进 `current_state.md` 和下一个 Task。

## 项目路线图 (Project Roadmap)

### 阶段 0: 项目理解 (Phase 0: Project Understanding)
当前阶段已完成。项目上下文、架构约束、任务路线图和审查报告已初始化。

### 阶段 1: 交互基线修复 (Phase 1: Interaction Baseline)
当前阶段已完成。登录页 Enter 提交能力已通过审查。

### 阶段 2: 统一低代码编辑模式 (Phase 2: Unified Low-code Editing)
- [x] **Task ID:** Task 002
  - **Status:** Completed / PASS (已完成 / 已通过)
  - **Goal:** 新增统一右侧配置面板基础能力。
  - **Scope:** 新增可复用配置面板，支持多个 JSON 分区、草稿状态、确认应用、取消/重置和错误提示。
  - **Files likely affected:** `src/components/`、`src/components/useDrawer.tsx`，可能涉及 `src/stores/appDrawerStore.ts`。
  - **Acceptance criteria:** 可以传入多个配置分区并在右侧抽屉展示；点击确认时解析 JSON；全部合法才触发应用回调；非法 JSON 不更新页面并显示错误；相关测试通过；执行日志已追加。
  - **Constraints:** 复用现有 CodeMirror / Drawer 能力；不新增依赖；不引入新模板 schema；不编辑运行时数据。
  - **Notes:** 配置面板第一版只做 JSON 编辑，不做结构化属性表单。配置分区应支持表单项、表单属性、搜索按钮、表格列、表格属性、表格按钮等结构。

- [x] **Task ID:** Task 003
  - **Status:** Completed / PASS (已完成 / 已通过)
  - **Goal:** 将普通表单页接入统一配置面板。
  - **Scope:** `formView` 在编辑模式下自动打开右侧配置面板，支持编辑 `formItems` 和 `formProps`；移除表单字段旁散落设置按钮。
  - **Files likely affected:** `src/views/formView/index.tsx`、`src/components/Form.tsx`。
  - **Acceptance criteria:** 开启编辑模式后右侧显示表单配置分区；修改合法 JSON 并确认后表单动态更新；非法 JSON 不应用；表单页面不再出现字段旁设置按钮；预览模式表单行为保持不变；相关测试通过；执行日志已追加。
  - **Constraints:** 不改现有 FormItem 数据结构；不做拖拽排序；不编辑表单运行时输入值。
  - **Notes:** 页面主体应保持预览布局，不被编辑控件挤压。旧 `FormEditorButton` 可以暂时保留文件，但 `Form` 不应再渲染字段级设置按钮。

- [x] **Task ID:** Task 004
  - **Status:** Completed / PASS (已完成 / 已通过)
  - **Goal:** 将 ProTable / TableView 接入统一配置面板。
  - **Scope:** 在编辑模式下通过右侧配置面板编辑搜索表单、搜索按钮、表格列、表格属性和表格操作按钮；移除旧的页面内设置按钮。
  - **Files likely affected:** `src/views/proTable/index.tsx`、`src/views/tableView/index.tsx`、`src/components/SearchFrom.tsx`、`src/components/CustomTable.tsx`、`src/components/ProTable.tsx`。
  - **Acceptance criteria:** 开启编辑模式后右侧显示 ProTable 配置分区；确认合法 JSON 后页面动态更新；搜索表单按钮和表格按钮配置可更新；表格列配置可更新；页面内不再出现旧的表单/按钮/列设置按钮；预览模式查询、重置、分页和操作按钮保持原行为；相关测试通过；执行日志已追加。
  - **Constraints:** 不接入后端；不新增依赖；不编辑表格运行时数据或 request 结果；不把旧“列显示与排序”按钮作为主要编辑入口。
  - **Notes:** 旧列显示/排序能力可先保留内部逻辑，后续再规划是否迁移为配置分区。本任务不做按钮样式单点修补。

- [x] **Task ID:** Task 005
  - **Status:** Completed / PASS (已完成 / 已通过)
  - **Goal:** 为统一编辑模式补充测试和验收。
  - **Scope:** 补充登录 Enter、配置面板应用、非法 JSON、编辑模式按钮移除等关键测试。
  - **Files likely affected:** `src/__tests__/`、相关组件测试辅助文件。
  - **Acceptance criteria:** `npm run test:unit -- --run` 通过；必要时 `npm run build` 通过；关键交互路径有测试覆盖；执行日志已追加。
  - **Constraints:** 不做功能扩展；不大量 snapshot 化 UI；不依赖真实浏览器服务。
  - **Notes:** 如果 Task 002-004 已分别补充足够测试，本任务可以作为整体验收和补漏任务。

### 阶段 3: 模板管理核心能力 (Phase 3: Core Template Features)
- [ ] **Task ID:** Task 006
  - **Status:** Pending (待办)
  - **Goal:** 实现最小模板列表页，用本地 mock 数据展示可管理的模板资产。
  - **Scope:** 新增或改造一个页面展示模板列表、模板名称、类型、更新时间、描述和基础操作入口；不做持久化。
  - **Files likely affected:** `src/views/`、`src/views/router.tsx`、`src/views/menu.tsx`，可能涉及 `src/stores/`。
  - **Acceptance criteria:** 可从菜单进入模板列表；列表使用现有 Naive UI/ProTable 能力；空状态和 mock 数据清晰；单元测试或组件测试覆盖关键逻辑；执行日志已追加。
  - **Constraints:** 不接入后端；不新增依赖；不破坏现有路由守卫。
  - **Notes:** 优先复用 `ProTable`，不要为了列表页引入新表格库。应在统一编辑模式稳定后执行。

- [ ] **Task ID:** Task 007
  - **Status:** Pending (待办)
  - **Goal:** 实现模板详情/预览的最小闭环。
  - **Scope:** 从模板列表进入详情页，展示模板配置 JSON/代码和基于现有组件的预览区域；不做保存。
  - **Files likely affected:** `src/views/`、`src/components/CardCodeEditor.tsx`、`src/views/router.tsx`。
  - **Acceptance criteria:** 能查看一个 mock 模板的配置；能看到对应表单或表格预览；非法配置有用户可见提示；相关测试通过；执行日志已追加。
  - **Constraints:** 不执行不可信远程代码；不引入后端；预览范围限制在现有 Form/ProTable 能力。
  - **Notes:** 先支持一到两种模板类型即可。

- [ ] **Task ID:** Task 008
  - **Status:** Pending (待办)
  - **Goal:** 实现本地模板编辑与导入导出的最小能力。
  - **Scope:** 支持编辑模板 JSON、校验基础字段、导出为 JSON 文件、从本地 JSON 导入；持久化可先使用 localStorage。
  - **Files likely affected:** `src/views/`、`src/stores/`、`src/types/`、`src/components/CardCodeEditor.tsx`。
  - **Acceptance criteria:** 用户可以编辑 mock 模板并在本地看到预览变化；导入非法 JSON 有明确错误；导出内容结构稳定；测试覆盖解析和错误分支；执行日志已追加。
  - **Constraints:** 不上传文件到服务端；不执行导入内容中的任意函数；不新增依赖。
  - **Notes:** 如果发现需要模板 schema 版本策略，先向 Planner 请求 ADR。

### 阶段 4: 打磨和发布 (Phase 4: Polish and Release)
- [ ] **Task ID:** Task 009
  - **Status:** Pending (待办)
  - **Goal:** 做一次低代码模板管理系统的 UI 一致性和可用性打磨。
  - **Scope:** 调整导航、页面标题、空状态、加载态、错误态、响应式细节；不新增大功能。
  - **Files likely affected:** `src/views/`、`src/components/`、`src/assets/`。
  - **Acceptance criteria:** 核心页面视觉一致；移动和桌面布局无明显溢出；测试通过；执行日志已追加。
  - **Constraints:** 不换 UI 库；不引入新的设计系统；不做无关重构。
  - **Notes:** 在核心模板管理闭环形成后再执行。

## 修复任务 (Bugfix Tasks)
*(保留给在 NEEDS_FIX 审查期间生成的任务)*

- [x] **Task ID:** Fix Task 002-005-A
  - **Status:** Completed / PASS (已完成 / 已通过)
  - **Goal:** 修复 Task 002-005 审查中发现的阻断问题，使统一低代码编辑模式达到可复审状态。
  - **Scope:** 仅修复本次 review_report.md 中列出的 Must Fix：Planner 文档越权改动、测试挂起、JsonConfigDrawer 错误展示、type-check 新增/相关类型问题。不要推进 Task 006 或新增功能。
  - **Files likely affected:** `docs/ai/architecture.md`、`docs/ai/tasklist.md`、`docs/ai/current_state.md`、`src/components/JsonConfigDrawer.tsx`、`src/__tests__/edit-mode-ui.spec.ts`、相关类型声明或受影响测试文件。
  - **Acceptance criteria:** `npm.cmd run test:unit -- --run` 稳定通过并退出；`npm.cmd run type-check` 对本次新增/修改范围无新增错误，或已有基线问题被清楚隔离并记录；非法 JSON 会显示对应分区错误且不会触发 apply；Planner 专属文档恢复到 Reviewer 认可状态；执行日志追加修复记录。
  - **Constraints:** 不新增依赖；不修改 `architecture.md` 的架构决策内容；不推进模板管理 Task 006+；`execution_log.md` 只能追加。
  - **Notes:** 本修复任务由 2026-05-28 Reviewer 对 Task 002-005 的 NEEDS_FIX 结论生成。

## 审查后续 (Review Follow-ups)
*(Reviewer 要求的不足以作为一个完整任务的微小调整)*

## 待办列表 (Backlog)
- [ ] **Backlog:** README 与临时调试产物整理
  - **Goal:** 清理项目入口文档与根目录 `tmp-*` 调试产物。
  - **Notes:** 当前优先级低于统一低代码编辑模式；后续在编辑主线稳定后执行。
- 为模板 schema 版本策略创建 ADR。
- 评估真实后端和持久化方案，但必须等前端本地闭环稳定后再规划。
- 评估模板导入安全模型，禁止直接执行不可信函数。
- 为 `.env.example` 建立环境变量说明，等项目出现环境变量时执行。

## 未来想法 (Future Ideas)
- 结构化属性表单：在 JSON 配置面板基础上，为常用字段提供可视化编辑控件。
- 模板收藏、标签、搜索和分类。
- 多模板类型：表单页、搜索表格页、详情页、仪表盘卡片。
- 模板代码生成能力。
- 模板版本历史与回滚。
- 远程模板仓库或团队共享。

## 已完成的任务 (Completed Tasks)
- [x] **Task ID:** Task 001
  - **Status:** Completed / PASS (已完成 / 已通过)
  - **Goal:** 登录页支持按 Enter 键触发登录。
  - **Scope:** 只修改登录页键盘交互，让 Enter 与点击登录按钮共用现有登录逻辑。
  - **Files affected:** `src/views/login/loginFrom.tsx`、`src/__tests__/login.spec.ts`
  - **Acceptance criteria:** 用户输入用户名和密码后按 Enter 可以登录；点击登录按钮仍正常；loading 状态下不会重复提交；相关测试通过；执行日志已追加。
  - **Constraints:** 未修改登录 store；未引入真实鉴权；未新增依赖；未改页面视觉设计。
  - **Notes:** 2026-05-27 Reviewer 审查结论为 PASS。下一任务为 Task 002。

- [x] **Task ID:** Task 000
  - **Status:** Completed / PASS (已完成 / 已通过)
  - **Goal:** 分析现有代码库并建立基线上下文。
  - **Scope:** 项目理解、文档初始化、任务规划；不写业务代码。
  - **Files likely affected:** `docs/ai/architecture.md`、`docs/ai/current_state.md`、`docs/ai/tasklist.md`、`docs/ai/review_report.md`
  - **Acceptance criteria:** 架构宪法、当前状态、任务路线图、审查报告均基于当前代码库完成实装；不修改 `docs/ai/execution_log.md`；不写业务代码。
  - **Constraints:** 保持轻量；不擅自引入新技术栈；基于现有代码做保守总结。
  - **Notes:** 本任务由用户明确要求 Planner / Reviewer / Tech Lead 执行。

---

### 任务格式参考（供 Planner 使用）
```markdown
- [ ] **Task ID:** [例如，Task 001]
  - **Status:** Pending (待办)
  - **Goal:** [清晰的单句目标]
  - **Scope:** [对应该修改的内容的严格限制]
  - **Files likely affected:** [列出文件或目录]
  - **Acceptance criteria:** [所需结果的要点清单]
  - **Constraints:** [例如，不要使用外部库，保持向后兼容性]
  - **Notes:** [为 Executor 提供的任何有用的上下文]
```
