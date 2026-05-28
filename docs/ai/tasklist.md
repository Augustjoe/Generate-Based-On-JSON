# 项目任务路线图 (Tasklist Roadmap)

此文件由 Planner (GPT-5.5) 维护。Executor (Codex) 只能阅读此文件以了解其当前任务。

## 工作流规则 (Workflow)
- Planner (GPT-5.5) 负责规划、拆分任务、维护 `architecture.md`、`tasklist.md`、`current_state.md`、`review_report.md`。
- Executor (Codex) 只执行当前分配的一个 Task，并在完成后向 `docs/ai/execution_log.md` 追加执行日志。
- Reviewer (GPT-5.5) 审查 Executor 的执行日志、git diff 和测试结果，给出 PASS / NEEDS_FIX / REJECT。
- 只有 Reviewer 给出 PASS 后，Planner 才推进 `current_state.md` 和下一个 Task。

## 已完成阶段归档 (Completed Roadmap Archive)

- **历史 Task 000-012:** PASS。已完成 AI 协作文档初始化、登录 Enter 提交、统一右侧 JSON 配置面板、模板列表/详情本地闭环、编辑模式入口、分区级应用/重置和编辑相关中文化。
- **历史结论:** 当前项目已从“模板管理雏形”转向“给前端开发者使用的低代码基础组件库”。后续任务从新的阶段一重新编号。

## 当前路线图 (Active Roadmap)

### 阶段一: 公共编辑能力基础设施
- [x] **Task ID:** Task 001
  - **Status:** PASS (已通过)
  - **Goal:** 新增基础组件自动注册的公共编辑能力，让外层统一判断和打开 JSON 配置面板。
  - **Scope:** 新增可编辑组件 registry/composable/store；支持注册、注销、读取当前页面可编辑配置、统一打开 `JsonConfigDrawer`；`SettingsDrawer` 根据 registry 显示“编辑当前页面”或“当前页面暂无可编辑组件”。
  - **Files likely affected:** `src/stores/` 或 `src/composables/`、`src/views/layout/components/SettingsDrawer.tsx`、`src/components/JsonConfigDrawer.tsx`、相关测试文件。
  - **Acceptance criteria:** 编辑模式关闭时不显示编辑入口和无组件提示；编辑模式开启且 registry 为空时显示“当前页面暂无可编辑组件”；registry 非空时显示“编辑当前页面”；点击后由公共逻辑打开 JSON 配置面板；页面不需要 watch 全局 trigger；相关测试通过；执行日志已追加。
  - **Constraints:** 不新增依赖；不改模板 schema；不接入后端；不做业务页面重构；保留现有 `JsonConfigDrawer` 分区级应用/重置能力。
  - **Notes:** 这是后续组件自动注册的基础任务。公共编辑能力应服务基础组件，不应绑定某个具体页面。

- [ ] **Task ID:** Task 002
  - **Status:** NEEDS_FIX (需修复)
  - **Goal:** 让 `Form` 自动注册自己的可编辑配置，并验证基础表单页面可通过外层入口编辑。
  - **Scope:** `Form` 挂载时注册 `formItems`、`formProps`；卸载时注销；应用 JSON 后通过已有 `update:formItems`、`update:formProps` 回写；移除 `formView` 中手写打开配置面板逻辑。
  - **Files likely affected:** `src/components/Form.tsx`、`src/views/formView/index.tsx`、`src/__tests__/edit-mode-ui.spec.ts` 或新增 registry 测试。
  - **Acceptance criteria:** 基本表单页使用 `Form` 后自动拥有编辑能力；点击外层“编辑当前页面”可编辑表单项和表单属性；应用单个分区后页面即时更新；关闭编辑模式关闭抽屉；相关测试通过；执行日志已追加。
  - **Constraints:** 不恢复旧的 `FormEditorButton` 页面内散落入口；不新增依赖；不改 `Form` 现有主要使用方式。
  - **Notes:** 可为组件增加 `editable?: boolean`、`editableTitle?: string`，默认开启；业务数据 `formData` 不纳入编辑面板。当前缺少 `formView` 对 `update:formItems` / `update:formProps` 的回写监听，请执行 Fix Task 002-003-A。

- [ ] **Task ID:** Task 003
  - **Status:** NEEDS_FIX (需修复)
  - **Goal:** 让 `SearchFrom` 和 `CustomTable` 自动注册配置，并移除表格/ProTable 页面中的手写编辑逻辑。
  - **Scope:** `SearchFrom` 注册 `formItems`、`formProps`、`ButtonItems`；`CustomTable` 注册 `columns`、`tableProps`、`tableButtons`；`tableView`、`proTable` 不再维护 `openConfigPanel` 或 trigger watcher。
  - **Files likely affected:** `src/components/SearchFrom.tsx`、`src/components/CustomTable.tsx`、`src/views/tableView/index.tsx`、`src/views/proTable/index.tsx`、相关测试文件。
  - **Acceptance criteria:** 基本表格页和 ProTable 页通过外层入口打开配置面板；搜索表单、搜索按钮、表格列、表格属性、表格按钮可分区编辑并回写；非可编辑页面显示“当前页面暂无可编辑组件”；相关测试通过；执行日志已追加。
  - **Constraints:** `ProTable` 不重复注册整组配置，优先让内部 `SearchFrom` 和 `CustomTable` 自动注册；不新增依赖；不做样式大改。
  - **Notes:** 同一页面可能存在多个可编辑组件，registry 需要能稳定区分分区标题和 key，避免重复覆盖。当前 `tableView` / `proTable` 缺少 `formProps`、`formButtonItems`、`tableProps` 等分区的父级回写监听，请执行 Fix Task 002-003-A。

### 阶段二: 表单详情组件
- [ ] **Task ID:** Task 004
  - **Status:** Pending (待办)
  - **Goal:** 删除模板列表入口，新增表单详情页面和菜单入口。
  - **Scope:** 从菜单和路由中移除模板列表页面入口；新增“表单详情”菜单和示例页面；页面先使用静态示例数据展示只读详情。
  - **Files likely affected:** `src/views/menu.tsx`、`src/views/router.tsx`、`src/views/templateList/`、`src/views/templateDetail/`、`src/views/formDetail/`、`src/views/layout/less/index.less`。
  - **Acceptance criteria:** 侧边栏不再显示模板列表入口；访问新“表单详情”菜单可看到只读详情示例；现有主控台、基本表单、基本表格、ProTable 路由不受影响；相关测试或类型检查通过；执行日志已追加。
  - **Constraints:** 先只移除菜单/路由入口；除非确认为未引用，否则不要大规模删除 template store/schema 代码；不接入后端。
  - **Notes:** 用户目标已转向组件能力展示，模板列表不再作为当前主线。

- [ ] **Task ID:** Task 005
  - **Status:** Pending (待办)
  - **Goal:** 封装 `FormDetail` 基础组件，用 `data + items + detailProps` 动态展示只读详情。
  - **Scope:** 新增 `FormDetail` 组件和类型；支持 `data`、`items`、`detailProps`；支持列数、边框、标签宽度、空值展示、跨列、基础 valueType 和 enum/tag 展示。
  - **Files likely affected:** `src/components/FormDetail.tsx`、`src/components/components.d.ts` 或类型声明文件、`src/views/formDetail/index.tsx`、相关测试文件。
  - **Acceptance criteria:** `FormDetail` 可通过配置展示详情；`data` 只作为业务值不被编辑；`items` 控制字段、标签、路径、跨列和展示类型；`detailProps` 控制整体布局；示例页面使用该组件；相关测试通过；执行日志已追加。
  - **Constraints:** 不允许 JSON 面板直接编辑或执行函数字符串；第一阶段 formatter 使用预设字符串或内置 valueType；不新增依赖。
  - **Notes:** 建议类型包括 `label`、`path`、`span`、`valueType`、`emptyText`、`options`、`detailItemProps`。开发者代码中可传 render 函数，但 JSON 编辑只处理可序列化配置。

- [ ] **Task ID:** Task 006
  - **Status:** Pending (待办)
  - **Goal:** 让 `FormDetail` 接入基础组件自动注册编辑能力。
  - **Scope:** `FormDetail` 自动注册 `items` 和 `detailProps`；支持 `editable?: boolean`、`editableTitle?: string`；应用 JSON 后回写配置并更新展示。
  - **Files likely affected:** `src/components/FormDetail.tsx`、`src/views/formDetail/index.tsx`、公共 editable registry、相关测试文件。
  - **Acceptance criteria:** 表单详情页在编辑模式下显示“编辑当前页面”；点击后可编辑详情项配置和详情布局配置；应用后详情展示即时变化；无业务数据编辑入口；相关测试通过；执行日志已追加。
  - **Constraints:** 不把 `data` 注册进编辑面板；不执行 JSON 中的函数；不影响 `Form`、`SearchFrom`、`CustomTable` 已有编辑能力。
  - **Notes:** 这是验证“新基础组件接入编辑基础设施”的样板任务。

### 阶段三: 异常页组件
- [ ] **Task ID:** Task 007
  - **Status:** Pending (待办)
  - **Goal:** 新增异常页菜单、路由和 `ExceptionPage` 基础组件。
  - **Scope:** 新增“异常页”父菜单及 403、404、500 子菜单；封装 `ExceptionPage`，通过配置展示状态码、标题、描述、图标/插画、操作按钮和扩展内容。
  - **Files likely affected:** `src/components/ExceptionPage.tsx`、`src/views/exception/`、`src/views/menu.tsx`、`src/views/router.tsx`、`src/views/layout/less/index.less`、相关测试文件。
  - **Acceptance criteria:** 403、404、500 三个页面可访问且展示美观；三页复用同一个基础组件；组件 props 可动态控制标题、描述、按钮和视觉状态；相关测试或类型检查通过；执行日志已追加。
  - **Constraints:** 不新增图片依赖；可使用 Naive UI 和现有图标包；不要创建纯营销式页面；页面应是可复用组件示例。
  - **Notes:** 异常页可先使用图标、状态码和布局样式实现，不要求外部图片资源。

- [ ] **Task ID:** Task 008
  - **Status:** Pending (待办)
  - **Goal:** 让 `ExceptionPage` 支持自动注册编辑配置。
  - **Scope:** `ExceptionPage` 注册异常页配置，如 status、title、description、actions、visualType/layout 等；应用 JSON 后即时更新。
  - **Files likely affected:** `src/components/ExceptionPage.tsx`、`src/views/exception/`、公共 editable registry、相关测试文件。
  - **Acceptance criteria:** 异常页在编辑模式下可通过外层入口编辑当前异常页配置；非业务数据不被误编辑；无可编辑组件页面仍显示无组件提示；相关测试通过；执行日志已追加。
  - **Constraints:** 不执行 JSON 函数字符串；按钮 action 第一阶段只允许预设动作或示例回调，不做动态代码执行。
  - **Notes:** 可把按钮配置限制为 `text`、`type`、`actionType`、`to` 等可序列化字段。

### 阶段四: 结果页组件
- [ ] **Task ID:** Task 009
  - **Status:** Pending (待办)
  - **Goal:** 新增结果页菜单、路由和 `ResultPage` 基础组件。
  - **Scope:** 新增“结果页”父菜单及成功页、失败页、信息页子菜单；封装 `ResultPage`，通过配置展示结果类型、标题、描述、详情区、操作按钮和扩展内容。
  - **Files likely affected:** `src/components/ResultPage.tsx`、`src/views/result/`、`src/views/menu.tsx`、`src/views/router.tsx`、`src/views/layout/less/index.less`、相关测试文件。
  - **Acceptance criteria:** 成功页、失败页、信息页三个页面可访问且展示美观；三页复用同一个基础组件；组件 props 可动态控制文案、状态、按钮和详情内容；相关测试或类型检查通过；执行日志已追加。
  - **Constraints:** 不新增依赖；不接入真实业务流程；不做复杂状态机。
  - **Notes:** 结果页要偏后台系统常见反馈页，视觉上保持简洁、稳定、可复用。

- [ ] **Task ID:** Task 010
  - **Status:** Pending (待办)
  - **Goal:** 让 `ResultPage` 支持自动注册编辑配置，并补齐新组件回归测试。
  - **Scope:** `ResultPage` 注册结果页配置；补充 editable registry、FormDetail、ExceptionPage、ResultPage 的关键测试；确认 `npm run test:unit -- --run` 和 `npm run type-check` 通过。
  - **Files likely affected:** `src/components/ResultPage.tsx`、`src/views/result/`、`src/__tests__/`、`docs/ai/execution_log.md`。
  - **Acceptance criteria:** 结果页在编辑模式下可通过外层入口编辑当前结果页配置；新基础组件关键渲染和注册行为有测试覆盖；全部单元测试和类型检查通过；执行日志已追加。
  - **Constraints:** 不扩大到真实后端、权限、多语言或模板市场；不做无关重构。
  - **Notes:** 这是本轮组件能力建设的收口任务，完成后再由 Reviewer 更新 `current_state.md`。

## 修复任务 (Bugfix Tasks)
- [ ] **Task ID:** Fix Task 002-003-A
  - **Status:** Pending (待办)
  - **Goal:** 补齐自动注册编辑分区的回写链路，确保 JSON 面板应用后示例页面即时更新。
  - **Scope:** 为 `formView` 补齐 `onUpdate:formItems`、`onUpdate:formProps`；为 `tableView` 和 `proTable` 补齐 `onUpdate:formProps`、`onUpdate:formButtonItems`、`onUpdate:tableProps`；补充 registry/组件应用回写测试。
  - **Files likely affected:** `src/views/formView/index.tsx`、`src/views/tableView/index.tsx`、`src/views/proTable/index.tsx`、`src/__tests__/edit-mode-ui.spec.ts` 或新增 registry 测试文件。
  - **Acceptance criteria:** 基本表单页应用 `formItems` / `formProps` 后页面状态更新；基本表格页和 ProTable 页应用搜索表单项、搜索表单属性、搜索按钮、表格列、表格属性、表格按钮后均能更新对应页面状态；公共入口仍按 registry 显示按钮或“当前页面暂无可编辑组件”；`npm run test:unit -- --run` 和 `npm run type-check` 通过；执行日志已追加。
  - **Constraints:** 不恢复页面内手写 `openConfigPanel`；不新增依赖；不改模板 schema；不推进阶段二功能。
  - **Notes:** `tableView` 中 `formProps` 是 reactive 对象，回写时应保留响应式引用；`proTable` 中相关配置多为 ref，可直接替换 `.value`。

## 审查后续 (Review Follow-ups)
*(Reviewer 要求的不足以作为完整任务的微小调整。)*

## 待办列表 (Backlog)
- README 与根目录临时调试产物整理。
- 为基础组件配置类型建立更集中的类型导出入口。
- 为函数/动态行为设计预设函数引用和 DSL 规则，不直接执行 JSON 中的函数字符串。
- 为组件配置导入安全模型创建 ADR。
- 后续再评估真实后端、持久化、模板版本和团队共享能力。

## 未来想法 (Future Ideas)
- 为常用配置提供结构化属性面板，减少直接编辑 JSON 的比例。
- 基础组件文档站和示例代码复制能力。
- 更多组件：查询筛选、步骤条表单、详情卡片、统计卡片、仪表盘区块。
- 模板代码生成能力。
- 远程组件配置仓库或团队共享。

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
