# AI Form Studio

AI Form Studio 是一个智能低代码表单搭建平台，面向企业后台、问卷收集、活动报名、信息采集、实习申请等场景。用户可以通过拖拽组件生成表单，也可以输入自然语言需求，由 Mock AI 生成一份可继续编辑的 FormSchema。

本项目不是大模型算法项目，也不是模型训练项目，而是一个展示前端工程能力的 Vue3 + TypeScript 项目。项目默认使用 Mock AI 模式，不依赖真实 API Key；没有 `.env` 文件时也能完整运行。

## 项目背景

很多后台系统都需要快速配置表单，例如报名表、反馈表、申请表、信息采集表。传统做法需要开发者手写每个表单页面，而低代码表单搭建平台可以通过 Schema 描述表单结构，再由渲染器动态生成真实表单。

AI Form Studio 用一个适合前端实习简历的完整项目，展示拖拽交互、Schema 驱动渲染、动态表单校验、JSON 导入导出、Pinia 状态管理和 localStorage 持久化。

## 技术栈

- Vue3
- TypeScript
- Vite
- Vue Router
- Pinia
- Element Plus
- vuedraggable / SortableJS
- Axios
- localStorage

## 功能列表

- 首页：展示项目介绍、核心功能、使用流程、技术栈和适用场景。
- 表单设计器：左侧组件面板、中间设计画布、右侧属性配置。
- 拖拽交互：支持拖拽添加组件、调整字段顺序、点击选中字段。
- 字段操作：支持修改属性、删除字段、复制字段、清空画布。
- 动态预览：根据当前 FormSchema 渲染真实表单。
- 表单校验：支持必填校验、数字范围校验、链接格式校验。
- 表单提交：提交后展示 JSON 格式提交结果。
- 表单列表：保存历史表单到 localStorage，支持查看、编辑、删除。
- Mock AI 生成：根据自然语言需求生成实习报名表、用户反馈表、活动报名表或通用信息收集表。
- JSON 管理：支持复制、导出、导入 FormSchema，并做基础合法性校验。

## 目录结构

```text
src/
  api/
    ai.ts
  assets/
  components/
    designer/
      ComponentPanel.vue
      DesignCanvas.vue
      PropertyPanel.vue
    form/
      DynamicFormRenderer.vue
      FormFieldRenderer.vue
      FormCard.vue
    schema/
      SchemaViewer.vue
    ai/
      AiFormGenerator.vue
    common/
      EmptyState.vue
      LoadingState.vue
      ErrorState.vue
  pages/
    Home.vue
    Designer.vue
    Preview.vue
    FormList.vue
    AiGenerate.vue
    SchemaManage.vue
  router/
    index.ts
  stores/
    form.ts
  types/
    index.ts
  utils/
    schema.ts
    storage.ts
    validator.ts
    id.ts
  App.vue
  main.ts
```

## 启动方式

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## Mock AI 说明

项目默认使用 Mock AI：

```text
VITE_AI_MODE=mock
```

没有 `.env` 文件时，`src/api/ai.ts` 会自动使用 mock 模式。Mock 规则示例：

- 输入“实习报名表”：生成姓名、手机号、学校、专业、年级、简历链接、实习时间等字段。
- 输入“用户反馈表”：生成满意度、反馈内容、联系方式等字段。
- 输入“活动报名表”：生成姓名、手机号、活动场次、参与人数等字段。
- 输入其他内容：生成通用信息收集表。

## 为什么不使用真实 API Key

本项目用于前端工程能力展示，核心是拖拽交互、Schema 设计、动态渲染、状态管理和本地持久化。真实 API Key 不应该提交到 GitHub，也不应该要求面试官配置密钥才能体验项目。因此项目默认使用 Mock AI，保证无后端、无 Key、无 `.env` 也能运行。

## 未来如何接入真实大模型 API

1. 复制 `.env.example` 为 `.env`。
2. 配置：

```text
VITE_AI_MODE=remote
VITE_AI_API_BASE_URL=https://your-api.example.com
VITE_AI_API_KEY=your_key
```

3. 修改 `src/api/ai.ts` 中的远程请求地址和响应映射。
4. 保持页面组件不变，因为组件只依赖 `generateFormSchema` 返回的 FormSchema。

## 核心实现思路

### 1. Schema 驱动

所有字段统一由 `FieldSchema` 描述，包括 `type`、`label`、`field`、`required`、`options`、`min`、`max` 等属性。设计器编辑 Schema，预览页读取 Schema 动态渲染真实表单。

### 2. 设计器三栏布局

- `ComponentPanel.vue`：展示可拖拽组件。
- `DesignCanvas.vue`：承载字段列表，使用 vuedraggable 调整顺序。
- `PropertyPanel.vue`：编辑选中字段属性，实时写回 Pinia。

### 3. 动态渲染

`DynamicFormRenderer.vue` 遍历 `schema.fields`，交给 `FormFieldRenderer.vue` 按字段类型渲染 Element Plus 表单控件。

### 4. 表单校验

`utils/validator.ts` 根据 Schema 执行必填、数字范围、链接格式校验，提交失败时给出错误信息。

### 5. 本地持久化

`stores/form.ts` 统一管理当前 Schema、选中字段、历史表单、AI 状态，并通过 `utils/storage.ts` 持久化到 localStorage。

## Schema 设计说明

```json
{
  "id": "form_001",
  "title": "实习报名表",
  "description": "用于收集实习申请信息",
  "fields": [
    {
      "id": "field_001",
      "type": "input",
      "label": "姓名",
      "field": "name",
      "placeholder": "请输入姓名",
      "required": true,
      "defaultValue": "",
      "helpText": "请填写真实姓名",
      "width": "100%"
    }
  ],
  "createdAt": "2026-06-01",
  "updatedAt": "2026-06-01"
}
```

## 项目亮点

- 完整低代码表单闭环：设计、配置、预览、校验、保存、导入导出。
- 使用 Schema 驱动动态渲染，设计器和预览页共享同一份数据结构。
- 使用 vuedraggable 实现字段顺序调整，体现前端交互能力。
- 使用 Pinia + localStorage 管理当前表单和历史表单。
- Mock AI 与组件解耦，后续接真实接口只需修改 `api/ai.ts`。

## 简历描述示例

AI Form Studio：基于 Vue3 + TypeScript 实现智能低代码表单搭建平台，支持拖拽添加字段、字段属性配置、Schema 驱动动态渲染、表单校验、JSON 导入导出、Mock AI 生成表单和 localStorage 持久化。项目使用 Pinia 管理当前表单、选中字段、历史记录和 AI 状态，封装 ComponentPanel、DesignCanvas、PropertyPanel、DynamicFormRenderer 等核心组件，展示完整前端工程能力。

## 面试官可能追问的问题

1. 为什么选择低代码表单作为前端实习项目？
2. 什么是 Schema 驱动渲染？
3. FieldSchema 和 FormSchema 是如何设计的？
4. 设计器三栏分别负责什么？
5. 拖拽添加组件和拖拽排序分别怎么实现？
6. vuedraggable 在项目中解决了什么问题？
7. 为什么 mock AI 逻辑不能写在组件里？
8. 没有 API Key 时项目为什么还能运行？
9. Pinia store 中管理了哪些状态？
10. localStorage 持久化怎么做？
11. 如何避免导入非法 JSON 导致页面崩溃？
12. 动态表单如何做必填校验？
13. 链接字段为什么需要单独校验？
14. 复制字段时如何避免 field/id 冲突？
15. 表单提交结果如何生成？
16. 未来接入真实 AI API 需要改哪些文件？
17. 如果字段很多，画布性能怎么优化？
18. 如果需要支持嵌套表单，Schema 怎么扩展？
19. 如果要做权限管理，路由和页面怎么改？
20. 如何把这个项目部署到 GitHub Pages？

## 后续优化方向

- 支持栅格布局、分组标题、分割线等高级组件。
- 支持字段联动和条件显隐。
- 支持多页面表单和步骤条表单。
- 支持 IndexedDB 存储更多表单数据。
- 增加 Vitest 单元测试和 Playwright 端到端测试。
- 增加 GitHub Pages 自动部署。
- 接入真实 OpenAI 兼容接口。

## Screenshots

可以在 `screenshots/` 目录中放置项目截图，例如首页、设计器、预览页、AI 生成页和 JSON 管理页。

## AI 辅助开发说明

本项目初版代码使用 AI 辅助完成，但重点在于本人对 Schema 设计、组件拆分、拖拽交互、状态管理、动态渲染和表单校验逻辑的理解与完善。项目适合作为前端实习求职作品，也适合继续迭代为更完整的低代码平台。
