# AI 穿搭搭配工具 Demo — 可执行开发计划

> 基于 `docs/raw-dev-plan.md`，结合任务要求的关键调整：**Fetch API 替代 Axios**、**直接接入阿里云百炼**、**现代化风格不强制绿色主色调**。

---

## 0. 关键技术决策摘要

| 决策项 | 原文档方案 | 本计划方案 | 原因 |
|--------|-----------|-----------|------|
| HTTP 客户端 | Axios | **Fetch API** | 任务明确要求 |
| AI 接口 | Mock + 抽象 Provider | **阿里云百炼真实调用 + 兜底** | 任务明确要求直接接入 |
| 样式方案 | UnoCSS + SCSS + 绿色主色 | **SCSS + CSS Variables + 现代中性色** | 不强制绿色，现代化风格 |
| 拖拽库 | Vue Draggable Plus | Vue Draggable Plus（不变） | 适合固定槽位式拖拽 |
| 数据存储 | 本地 JSON | 本地 JSON（不变） | Demo 版本足够 |

---

## 1. 项目目录结构（最终版）

```
outfit-ai-studio/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── env.d.ts
│   ├── .env
│   ├── .env.development
│   └── src/
│       ├── main.ts
│       ├── App.vue
│       ├── router/
│       │   └── index.ts
│       ├── stores/
│       │   └── outfit.ts
│       ├── api/
│       │   ├── request.ts          ← Fetch API 封装
│       │   ├── items.ts
│       │   ├── outfits.ts
│       │   └── generation.ts
│       ├── types/
│       │   └── outfit.ts
│       ├── views/
│       │   └── OutfitPreview/
│       │       ├── index.vue
│       │       ├── components/
│       │       │   ├── ItemLibrary.vue
│       │       │   ├── ItemCard.vue
│       │       │   ├── OutfitCanvas.vue
│       │       │   ├── OutfitSlot.vue
│       │       │   ├── ResultPreview.vue
│       │       │   └── TopActions.vue
│       │       └── composables/
│       │           ├── useItemFilter.ts
│       │           └── usePromptBuilder.ts
│       └── styles/
│           ├── variables.scss
│           └── global.scss
│
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   ├── .env
│   ├── .env.example
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── items/
│   │   │   ├── items.module.ts
│   │   │   ├── items.controller.ts
│   │   │   └── items.service.ts
│   │   ├── outfits/
│   │   │   ├── outfits.module.ts
│   │   │   ├── outfits.controller.ts
│   │   │   └── outfits.service.ts
│   │   ├── generation/
│   │   │   ├── generation.module.ts
│   │   │   ├── generation.controller.ts
│   │   │   ├── generation.service.ts
│   │   │   └── bailian.provider.ts   ← 阿里云百炼真实调用
│   │   └── common/
│   │       ├── file-db.ts
│   │       └── types.ts
│   ├── data/
│   │   ├── items.json
│   │   ├── outfits.json
│   │   └── generation-tasks.json
│   └── public/
│       ├── uploads/              ← 单品图片占位
│       └── generated/            ← AI 生成图 + 兜底图
│
├── .gitignore
└── README.md
```

---

## 2. 阶段划分与并行机会

### 总览图

```
Phase 0: 项目脚手架（前端 + 后端可并行）
    ├── Frontend: Vite + Vue3 + TS 初始化
    └── Backend:  NestJS 初始化
         ↓
Phase 1: 类型定义 + Mock 数据 + 基础设施（三者可并行）
    ├── Types: 前后端共享类型
    ├── Data:  items.json + 兜底图
    └── Infra: Fetch 封装 + Pinia store + 后端 file-db
         ↓
Phase 2: 静态页面 + 后端 CRUD（前端页面与后端接口可并行）
    ├── Frontend: 三栏布局 + 所有组件静态版
    └── Backend:  GET /api/items + POST /api/outfits
         ↓
Phase 3: 交互联调（依赖 Phase 2 两端完成）
    ├── 拖拽实现
    ├── 点击加入搭配
    └── 搜索筛选
         ↓
Phase 4: AI 生成闭环（依赖 Phase 3）
    ├── Prompt Builder
    ├── 百炼 API 集成
    └── 生成状态管理
         ↓
Phase 5: 打磨与兜底（依赖 Phase 4）
    ├── 兜底图机制
    ├── 空状态/禁用/错误优化
    └── 样式微调
```

---

## 3. 各阶段详细计划

---

### Phase 0: 项目脚手架

**并行组 A — 前端初始化** 与 **并行组 B — 后端初始化** 可同时进行。

#### 并行组 A: 前端项目初始化

**创建文件清单：**

| 文件 | 说明 |
|------|------|
| `frontend/package.json` | 依赖声明 |
| `frontend/vite.config.ts` | Vite 配置 + 路径别名 |
| `frontend/tsconfig.json` | TS 配置入口 |
| `frontend/tsconfig.app.json` | App TS 配置 |
| `frontend/tsconfig.node.json` | Node TS 配置 |
| `frontend/index.html` | HTML 入口 |
| `frontend/env.d.ts` | 环境变量类型声明 |
| `frontend/.env` | 默认环境变量 |
| `frontend/.env.development` | 开发环境变量 |
| `frontend/src/main.ts` | 应用入口 |
| `frontend/src/App.vue` | 根组件 |
| `frontend/.gitignore` | 前端 gitignore |

**依赖安装：**
```bash
npm create vite@latest frontend -- --template vue-ts
cd frontend
npm install naive-ui pinia vue-router@4 vue-draggable-plus
npm install -D sass @types/node
```

**技术要点：**

1. **vite.config.ts** — 路径别名 + 开发代理：
```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
```

2. **main.ts** — 注册 NaiveUI / Pinia / Router：
```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import naive from 'naive-ui'
import App from './App.vue'
import router from './router'
import './styles/global.scss'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(naive)
app.mount('#app')
```

3. **环境变量** — `.env.development`：
```
VITE_API_BASE_URL=http://localhost:3000
```

**验证标准：**
- `npm run dev` 启动无报错
- 浏览器访问 `http://localhost:5173` 看到空白 Vue 页面

---

#### 并行组 B: 后端项目初始化

**创建文件清单：**

| 文件 | 说明 |
|------|------|
| `backend/package.json` | 依赖声明 |
| `backend/tsconfig.json` | TS 配置 |
| `backend/nest-cli.json` | NestJS CLI 配置 |
| `backend/.env` | 环境变量（含百炼 API Key） |
| `backend/.env.example` | 环境变量模板 |
| `backend/src/main.ts` | NestJS 入口 |
| `backend/src/app.module.ts` | 根模块 |
| `backend/.gitignore` | 后端 gitignore |

**依赖安装：**
```bash
npx @nestjs/cli new backend --package-manager npm --skip-git
cd backend
npm install @nestjs/serve-static dotenv
```

**技术要点：**

1. **main.ts** — CORS + 静态资源 + dotenv：
```ts
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import 'dotenv/config'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors()
  app.useStaticAssets(join(__dirname, '..', 'public'))
  await app.listen(3000)
}
bootstrap()
```

2. **.env.example**：
```
# 阿里云百炼 API
BAILIAN_API_KEY=your_api_key_here
BAILIAN_API_URL=https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis
BAILIAN_MODEL=wanx-v1

# Mock 模式开关（true=使用兜底图，false=调用真实百炼API）
AI_IMAGE_USE_MOCK=false
```

**验证标准：**
- `npm run start:dev` 启动无报错
- `http://localhost:3000` 可访问

---

### Phase 1: 类型定义 + Mock 数据 + 基础设施

三个子任务可并行。

#### 1A: 类型定义

**文件：** `frontend/src/types/outfit.ts`

```ts
// 服装分类
export type ClothingCategory =
  | 'top'
  | 'bottom'
  | 'dress'
  | 'outerwear'
  | 'shoes'
  | 'bag'
  | 'accessory'

// 分类中文映射
export const categoryLabelMap: Record<ClothingCategory, string> = {
  top: '上衣',
  bottom: '下装',
  dress: '连衣裙',
  outerwear: '外套',
  shoes: '鞋',
  bag: '包',
  accessory: '配饰',
}

// 单品数据
export interface ClothingItem {
  id: string
  name: string
  category: ClothingCategory
  color: string
  season: string[]
  occasion: string[]
  imageUrl: string
  note?: string
}

// 搭配选择（槽位映射）
export interface OutfitSelection {
  outerwear?: ClothingItem
  top?: ClothingItem
  bottom?: ClothingItem
  dress?: ClothingItem
  shoes?: ClothingItem
  bag?: ClothingItem
  accessory?: ClothingItem[]
}

// 生成状态
export type GenerateStatus = 'idle' | 'generating' | 'success' | 'failed'

// API 通用响应
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// 槽位定义（用于搭配区渲染）
export interface SlotDefinition {
  key: keyof OutfitSelection
  label: string
  acceptCategory: ClothingCategory
  maxCount: number  // 1 for most, Infinity for accessory
}

export const outfitSlots: SlotDefinition[] = [
  { key: 'outerwear', label: '外套', acceptCategory: 'outerwear', maxCount: 1 },
  { key: 'top', label: '上衣', acceptCategory: 'top', maxCount: 1 },
  { key: 'bottom', label: '下装', acceptCategory: 'bottom', maxCount: 1 },
  { key: 'dress', label: '连衣裙', acceptCategory: 'dress', maxCount: 1 },
  { key: 'shoes', label: '鞋', acceptCategory: 'shoes', maxCount: 1 },
  { key: 'bag', label: '包', acceptCategory: 'bag', maxCount: 1 },
  { key: 'accessory', label: '配饰', acceptCategory: 'accessory', maxCount: Infinity },
]
```

**后端类型文件：** `backend/src/common/types.ts` — 镜像前端类型（保持一致）。

---

#### 1B: Mock 数据

**文件：** `backend/data/items.json`

预置 25 个单品，覆盖所有 7 个分类，每个分类至少 3 个。示例结构见原文档 §13。

**文件：** `backend/data/outfits.json` — 初始为 `[]`

**文件：** `backend/data/generation-tasks.json` — 初始为 `[]`

**兜底图：** `backend/public/generated/` 放 3 张占位 PNG（可用纯色渐变图代替，文件名 `fallback-001.png` ~ `fallback-003.png`）

**单品图片：** `backend/public/uploads/` 放占位图片（可用 SVG 占位符或纯色 PNG）

---

#### 1C: 基础设施

**1C-1: Fetch API 封装** — `frontend/src/api/request.ts`

```ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

interface RequestOptions extends Omit<RequestInit, 'body'> {
  data?: unknown
  params?: Record<string, string | number | boolean | undefined>
}

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { data, params, method = 'GET', ...rest } = options

  // 构建 URL（处理 query params）
  let fullUrl = `${BASE_URL}${url}`
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.set(key, String(value))
    })
    const qs = searchParams.toString()
    if (qs) fullUrl += `?${qs}`
  }

  // 构建 fetch options
  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...rest,
  }

  if (data && method !== 'GET') {
    fetchOptions.body = JSON.stringify(data)
  }

  const response = await fetch(fullUrl, fetchOptions)

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`HTTP ${response.status}: ${errorBody}`)
  }

  const result = await response.json()

  // 业务层错误码检查
  if (result.code !== 0) {
    throw new Error(result.message || '请求失败')
  }

  return result.data as T
}

export function get<T>(url: string, params?: Record<string, string | number | boolean | undefined>) {
  return request<T>(url, { method: 'GET', params })
}

export function post<T>(url: string, data?: unknown) {
  return request<T>(url, { method: 'POST', data })
}

export function put<T>(url: string, data?: unknown) {
  return request<T>(url, { method: 'PUT', data })
}

export function del<T>(url: string) {
  return request<T>(url, { method: 'DELETE' })
}
```

**1C-2: Pinia Store** — `frontend/src/stores/outfit.ts`

```ts
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { ClothingItem, ClothingCategory, OutfitSelection, GenerateStatus } from '@/types/outfit'

export const useOutfitStore = defineStore('outfit', () => {
  // State
  const selectedItems = reactive<OutfitSelection>({})
  const resultImageUrl = ref('')
  const generateStatus = ref<GenerateStatus>('idle')
  const generateError = ref('')
  const currentPrompt = ref('')
  const isFallback = ref(false)

  // Actions
  function addItem(item: ClothingItem) {
    if (item.category === 'accessory') {
      if (!selectedItems.accessory) {
        selectedItems.accessory = []
      }
      const exists = selectedItems.accessory.some(i => i.id === item.id)
      if (!exists) {
        selectedItems.accessory.push(item)
      }
      return
    }
    // 其他分类直接赋值（替换）
    ;(selectedItems as Record<string, ClothingItem | ClothingItem[] | undefined>)[item.category] = item
  }

  function removeItem(category: ClothingCategory, itemId?: string) {
    if (category === 'accessory' && itemId && selectedItems.accessory) {
      selectedItems.accessory = selectedItems.accessory.filter(i => i.id !== itemId)
      if (selectedItems.accessory.length === 0) {
        delete selectedItems.accessory
      }
      return
    }
    delete (selectedItems as Record<string, unknown>)[category]
  }

  function clearOutfit() {
    Object.keys(selectedItems).forEach(key => {
      delete (selectedItems as Record<string, unknown>)[key]
    })
    resultImageUrl.value = ''
    generateStatus.value = 'idle'
    generateError.value = ''
    currentPrompt.value = ''
    isFallback.value = false
  }

  function setGenerating() {
    generateStatus.value = 'generating'
    generateError.value = ''
    isFallback.value = false
  }

  function setGenerateSuccess(url: string, fallback = false) {
    resultImageUrl.value = url
    generateStatus.value = 'success'
    isFallback.value = fallback
  }

  function setGenerateFailed(error: string) {
    generateStatus.value = 'failed'
    generateError.value = error
  }

  // Getters
  function hasSelectedItems(): boolean {
    return Object.values(selectedItems).some(value => {
      if (Array.isArray(value)) return value.length > 0
      return Boolean(value)
    })
  }

  return {
    selectedItems,
    resultImageUrl,
    generateStatus,
    generateError,
    currentPrompt,
    isFallback,
    addItem,
    removeItem,
    clearOutfit,
    setGenerating,
    setGenerateSuccess,
    setGenerateFailed,
    hasSelectedItems,
  }
})
```

**1C-3: 后端 file-db 工具** — `backend/src/common/file-db.ts`

```ts
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const DATA_DIR = join(__dirname, '..', '..', 'data')

export function readJson<T>(filename: string): T {
  const filepath = join(DATA_DIR, filename)
  if (!existsSync(filepath)) {
    return [] as unknown as T
  }
  return JSON.parse(readFileSync(filepath, 'utf-8'))
}

export function writeJson<T>(filename: string, data: T): void {
  const filepath = join(DATA_DIR, filename)
  writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8')
}
```

**1C-4: 样式基础** — `frontend/src/styles/variables.scss`

```scss
:root {
  // 主色 — 现代中性蓝灰调，不强制绿色
  --color-primary: #4f6d7a;
  --color-primary-light: #e8f0f2;
  --color-primary-hover: #3d5a66;

  // 背景
  --color-bg: #f5f6f8;
  --color-panel: #ffffff;
  --color-border: #e2e6ea;

  // 文字
  --color-text: #1a2332;
  --color-text-secondary: #6b7a8d;
  --color-muted: #9aa5b1;

  // 状态色
  --color-success: #2eac6d;
  --color-warning: #e6a23c;
  --color-danger: #e05252;

  // 圆角
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;

  // 间距
  --gap-sm: 8px;
  --gap-md: 16px;
  --gap-lg: 24px;

  // 面板宽度
  --panel-side-width: 320px;
}
```

`frontend/src/styles/global.scss`:
```scss
@use './variables' as *;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: var(--color-text);
  background: var(--color-bg);
}

// 滚动条美化
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}
```

**验证标准：**
- 类型文件无 TS 错误
- Fetch 封装可编译
- Pinia store 可编译
- 后端 file-db 可编译
- items.json 格式正确

---

### Phase 2: 静态页面 + 后端 CRUD

前端页面与后端接口可并行开发。

#### 2A: 前端静态页面

**文件清单：**

| 文件 | 职责 |
|------|------|
| `frontend/src/router/index.ts` | 路由配置 |
| `frontend/src/views/OutfitPreview/index.vue` | 主页面三栏布局 |
| `frontend/src/views/OutfitPreview/components/TopActions.vue` | 顶部操作按钮 |
| `frontend/src/views/OutfitPreview/components/ItemLibrary.vue` | 左侧单品库 |
| `frontend/src/views/OutfitPreview/components/ItemCard.vue` | 单品卡片 |
| `frontend/src/views/OutfitPreview/components/OutfitCanvas.vue` | 中间搭配区 |
| `frontend/src/views/OutfitPreview/components/OutfitSlot.vue` | 单个搭配槽位 |
| `frontend/src/views/OutfitPreview/components/ResultPreview.vue` | 右侧成果展示 |

**组件边界与职责：**

```
index.vue (布局壳)
├── TopActions (清空/保存/生成按钮)
├── ItemLibrary (搜索+筛选+卡片列表)
│   └── ItemCard × N (单品卡片，可拖拽)
├── OutfitCanvas (槽位容器)
│   └── OutfitSlot × 7 (固定槽位，可接收拖拽)
└── ResultPreview (状态展示：idle/generating/success/failed)
```

**Props/Emits 契约：**

| 组件 | Props | Emits |
|------|-------|-------|
| `TopActions` | `disabled: boolean` (生成中禁用) | `clear`, `save`, `generate` |
| `ItemCard` | `item: ClothingItem` | `add(item)` |
| `ItemLibrary` | 无（内部调 API） | `select-item(item)` |
| `OutfitSlot` | `slotDef: SlotDefinition`, `item?: ClothingItem` | `remove(category, id?)`, `drop-item(item)` |
| `OutfitCanvas` | 无（读 store） | 无（直接操作 store） |
| `ResultPreview` | 无（读 store） | `regenerate` |

**关键布局 — index.vue：**

```vue
<script setup lang="ts">
import TopActions from './components/TopActions.vue'
import ItemLibrary from './components/ItemLibrary.vue'
import OutfitCanvas from './components/OutfitCanvas.vue'
import ResultPreview from './components/ResultPreview.vue'
</script>

<template>
  <div class="outfit-preview-page">
    <header class="page-header">
      <div class="header-left">
        <span class="page-subtitle">OUTFIT PREVIEW</span>
        <h1 class="page-title">AI 穿搭预演工具</h1>
      </div>
      <TopActions />
    </header>
    <main class="page-main">
      <aside class="left-panel"><ItemLibrary /></aside>
      <section class="center-panel"><OutfitCanvas /></section>
      <aside class="right-panel"><ResultPreview /></aside>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.outfit-preview-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}
.page-header {
  height: 64px;
  padding: 0 var(--gap-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-panel);
}
.page-subtitle {
  font-size: 12px;
  color: var(--color-muted);
  letter-spacing: 2px;
}
.page-title {
  font-size: 20px;
  font-weight: 600;
}
.page-main {
  flex: 1;
  display: grid;
  grid-template-columns: var(--panel-side-width) minmax(500px, 1fr) var(--panel-side-width);
  gap: var(--gap-md);
  padding: var(--gap-md);
  overflow: hidden;
}
.left-panel, .center-panel, .right-panel {
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
```

**验证标准：**
- 三栏布局正确显示
- 各面板有基本内容占位
- 响应式：窗口缩小时中间区域自适应

---

#### 2B: 后端 CRUD 接口

**文件清单：**

| 文件 | 职责 |
|------|------|
| `backend/src/items/items.module.ts` | Items 模块 |
| `backend/src/items/items.controller.ts` | GET /api/items |
| `backend/src/items/items.service.ts` | 读取 items.json + 筛选 |
| `backend/src/outfits/outfits.module.ts` | Outfits 模块 |
| `backend/src/outfits/outfits.controller.ts` | POST /api/outfits |
| `backend/src/outfits/outfits.service.ts` | 写入 outfits.json |
| `backend/src/app.module.ts` | 注册所有模块 |

**GET /api/items 实现要点：**

```ts
// items.controller.ts
@Controller('api/items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll(@Query() query: { keyword?: string; category?: string; season?: string; occasion?: string }) {
    return this.itemsService.findAll(query)
  }
}

// items.service.ts
@Injectable()
export class ItemsService {
  findAll(filter: { keyword?: string; category?: string; season?: string; occasion?: string }) {
    let items = readJson<ClothingItem[]>('items.json')

    if (filter.keyword) {
      const kw = filter.keyword.toLowerCase()
      items = items.filter(i =>
        i.name.toLowerCase().includes(kw) ||
        i.color.toLowerCase().includes(kw) ||
        (i.note && i.note.toLowerCase().includes(kw))
      )
    }
    if (filter.category) {
      items = items.filter(i => i.category === filter.category)
    }
    if (filter.season) {
      items = items.filter(i => i.season.includes(filter.season!))
    }
    if (filter.occasion) {
      items = items.filter(i => i.occasion.includes(filter.occasion!))
    }

    return { code: 0, message: 'ok', data: items }
  }
}
```

**POST /api/outfits 实现要点：**

```ts
// outfits.controller.ts
@Controller('api/outfits')
export class OutfitsController {
  constructor(private readonly outfitsService: OutfitsService) {}

  @Post()
  create(@Body() body: { name: string; items: Record<string, unknown> }) {
    return this.outfitsService.create(body)
  }
}

// outfits.service.ts
@Injectable()
export class OutfitsService {
  create(data: { name: string; items: Record<string, unknown> }) {
    const outfits = readJson<OutfitRecord[]>('outfits.json')
    const newOutfit: OutfitRecord = {
      id: `outfit_${String(outfits.length + 1).padStart(3, '0')}`,
      name: data.name,
      items: data.items,
      createdAt: new Date().toISOString(),
    }
    outfits.push(newOutfit)
    writeJson('outfits.json', outfits)
    return { code: 0, message: '保存成功', data: newOutfit }
  }
}
```

**验证标准：**
- `GET /api/items` 返回 items.json 数据
- `GET /api/items?category=top` 正确筛选
- `GET /api/items?keyword=夹克` 正确搜索
- `POST /api/outfits` 保存成功并写入文件

---

### Phase 3: 交互联调

**依赖：** Phase 2 前后端都完成。

**文件清单：**

| 文件 | 变更 |
|------|------|
| `frontend/src/api/items.ts` | 新建 — 调用 GET /api/items |
| `frontend/src/api/outfits.ts` | 新建 — 调用 POST /api/outfits |
| `frontend/src/views/OutfitPreview/composables/useItemFilter.ts` | 新建 — 搜索筛选逻辑 |
| `frontend/src/views/OutfitPreview/components/ItemLibrary.vue` | 完善 — 接入 API + 筛选 |
| `frontend/src/views/OutfitPreview/components/ItemCard.vue` | 完善 — 拖拽 + 加入搭配 |
| `frontend/src/views/OutfitPreview/components/OutfitCanvas.vue` | 完善 — 接收拖拽 |
| `frontend/src/views/OutfitPreview/components/OutfitSlot.vue` | 完善 — 拖拽目标 + 删除 |
| `frontend/src/views/OutfitPreview/components/TopActions.vue` | 完善 — 清空/保存逻辑 |

**3A: API 调用层**

`frontend/src/api/items.ts`:
```ts
import { get } from './request'
import type { ClothingItem } from '@/types/outfit'

export function getItems(params?: {
  keyword?: string
  category?: string
  season?: string
  occasion?: string
}) {
  return get<ClothingItem[]>('/api/items', params)
}
```

`frontend/src/api/outfits.ts`:
```ts
import { post } from './request'
import type { OutfitSelection } from '@/types/outfit'

export function saveOutfit(data: { name: string; items: OutfitSelection }) {
  return post<{ id: string; name: string; createdAt: string }>('/api/outfits', data)
}
```

**3B: useItemFilter composable**

```ts
import { ref, computed } from 'vue'
import type { ClothingItem, ClothingCategory } from '@/types/outfit'

export function useItemFilter(items: Ref<ClothingItem[]>) {
  const keyword = ref('')
  const selectedCategory = ref<ClothingCategory | ''>('')
  const selectedSeason = ref('')
  const selectedOccasion = ref('')

  const filteredItems = computed(() => {
    let result = items.value

    if (keyword.value) {
      const kw = keyword.value.toLowerCase()
      result = result.filter(i =>
        i.name.toLowerCase().includes(kw) ||
        i.color.toLowerCase().includes(kw) ||
        (i.note && i.note.toLowerCase().includes(kw))
      )
    }
    if (selectedCategory.value) {
      result = result.filter(i => i.category === selectedCategory.value)
    }
    if (selectedSeason.value) {
      result = result.filter(i => i.season.includes(selectedSeason.value))
    }
    if (selectedOccasion.value) {
      result = result.filter(i => i.occasion.includes(selectedOccasion.value))
    }

    return result
  })

  // 提取可用的季节/场合选项（从数据中动态生成）
  const seasonOptions = computed(() => {
    const set = new Set<string>()
    items.value.forEach(i => i.season.forEach(s => set.add(s)))
    return [...set]
  })

  const occasionOptions = computed(() => {
    const set = new Set<string>()
    items.value.forEach(i => i.occasion.forEach(o => set.add(o)))
    return [...set]
  })

  return {
    keyword,
    selectedCategory,
    selectedSeason,
    selectedOccasion,
    filteredItems,
    seasonOptions,
    occasionOptions,
  }
}
```

**3C: 拖拽实现方案**

使用 Vue Draggable Plus 的 `VueDraggable` 组件模式（推荐，最直观）。

**核心模式：Clone + Category Filter**

- 源列表（单品库）：`group: { name: 'outfit-items', pull: 'clone', put: false }` — 拖出时克隆，不接受拖入
- 目标槽位：`group: { name: 'outfit-items', put: (to, from, dragEl) => dragEl.dataset.category === slot.acceptCategory }` — 按分类过滤

**ItemCard（拖拽源 — 嵌入在 VueDraggable 内）：**

```vue
<!-- ItemLibrary.vue 中的列表部分 -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { VueDraggable, type DraggableEvent } from 'vue-draggable-plus'
import { getItems } from '@/api/items'
import { useItemFilter } from '../composables/useItemFilter'
import ItemCard from './ItemCard.vue'
import type { ClothingItem } from '@/types/outfit'

const allItems = ref<ClothingItem[]>([])
const { keyword, selectedCategory, selectedSeason, selectedOccasion, filteredItems, seasonOptions, occasionOptions } = useItemFilter(allItems)

onMounted(async () => {
  allItems.value = await getItems()
})
</script>

<template>
  <div class="item-library">
    <!-- 搜索/筛选控件（使用 NaiveUI 组件） -->
    <n-input v-model:value="keyword" placeholder="搜索单品..." clearable />
    <n-select v-model:value="selectedCategory" :options="categoryOptions" clearable placeholder="分类" />
    <!-- ... 其他筛选 ... -->

    <!-- 可拖拽的单品列表 -->
    <VueDraggable
      v-model="filteredItems"
      :group="{ name: 'outfit-items', pull: 'clone', put: false }"
      :sort="false"
      :animation="150"
      ghost-class="drag-ghost"
      class="item-list"
    >
      <ItemCard
        v-for="item in filteredItems"
        :key="item.id"
        :item="item"
        :data-category="item.category"
        @add="(item) => store.addItem(item)"
      />
    </VueDraggable>
  </div>
</template>
```

**ItemCard.vue：**
```vue
<script setup lang="ts">
import type { ClothingItem } from '@/types/outfit'
import { useOutfitStore } from '@/stores/outfit'

const props = defineProps<{ item: ClothingItem }>()
const emit = defineEmits<{ add: [item: ClothingItem] }>()
const store = useOutfitStore()

function handleAdd() {
  store.addItem(props.item)
}
</script>

<template>
  <div class="item-card" :data-category="item.category">
    <div class="item-image">
      <img :src="item.imageUrl" :alt="item.name" />
    </div>
    <div class="item-info">
      <span class="item-name">{{ item.name }}</span>
      <div class="item-tags">
        <n-tag size="small">{{ item.color }}</n-tag>
        <n-tag size="small" type="info">{{ categoryLabelMap[item.category] }}</n-tag>
      </div>
    </div>
    <n-button size="tiny" @click="handleAdd">加入搭配</n-button>
  </div>
</template>
```

**OutfitSlot（拖拽目标 — 带分类过滤）：**
```vue
<script setup lang="ts">
import { computed } from 'vue'
import { VueDraggable, type DraggableEvent } from 'vue-draggable-plus'
import { useOutfitStore } from '@/stores/outfit'
import type { SlotDefinition, ClothingItem } from '@/types/outfit'

const props = defineProps<{ slotDef: SlotDefinition }>()
const store = useOutfitStore()

// 槽位内列表（accessory 可多个，其他最多1个）
const slotItems = computed({
  get: () => {
    const val = store.selectedItems[props.slotDef.key]
    if (!val) return []
    if (Array.isArray(val)) return val
    return [val]
  },
  set: (newVal: ClothingItem[]) => {
    // VueDraggable v-model 会直接修改数组
    // 我们在 onAdd/onRemove 中通过 store 操作，这里留空
  },
})

// 关键：group.put 函数实现分类过滤
const groupConfig = computed(() => ({
  name: 'outfit-items',
  put: (to: any, from: any, dragEl: HTMLElement): boolean => {
    const category = dragEl.dataset.category
    if (category !== props.slotDef.acceptCategory) {
      window.$message?.warning('该单品不能放入当前区域')
      return false
    }
    // 非配饰槽位已有单品时，允许替换（返回 true，在 onAdd 中处理替换逻辑）
    return true
  },
}))

function onAdd(e: DraggableEvent<ClothingItem>) {
  const item = e.data
  if (!item) return
  store.addItem(item)
}

function handleRemove(category: string, itemId?: string) {
  store.removeItem(category as any, itemId)
}
</script>

<template>
  <div class="outfit-slot">
    <div class="slot-header">
      <span class="slot-label">{{ slotDef.label }}</span>
    </div>
    <VueDraggable
      v-model="slotItems"
      :group="groupConfig"
      :animation="150"
      class="slot-drop-zone"
      :class="{ 'has-item': slotItems.length > 0 }"
      @add="onAdd"
    >
      <div v-for="item in slotItems" :key="item.id" class="slot-item" :data-category="item.category">
        <img :src="item.imageUrl" :alt="item.name" />
        <span>{{ item.name }}</span>
        <n-button quaternary circle size="tiny" class="remove-btn" @click="handleRemove(slotDef.key, item.id)">
          ✕
        </n-button>
      </div>
      <!-- 空状态 -->
      <div v-if="slotItems.length === 0" class="slot-empty">
        <span>拖拽或点击添加{{ slotDef.label }}</span>
      </div>
    </VueDraggable>
  </div>
</template>
```

**拖拽关键点总结：**

| 配置项 | 源（单品库） | 目标（槽位） |
|--------|------------|------------|
| `group.name` | `'outfit-items'` | `'outfit-items'` |
| `group.pull` | `'clone'`（拖出克隆） | 默认（可拖出） |
| `group.put` | `false`（不接受拖入） | 函数：按 `dataset.category` 过滤 |
| `sort` | `false`（源列表不排序） | 默认 |
| `data-category` | 绑定在 ItemCard DOM 上 | 读取用于过滤 |
| 事件 | `@clone`（可选） | `@add`（处理放入逻辑） |

> **重要：** `data-category` 必须绑定在 VueDraggable 的直接子元素 DOM 上（即 ItemCard 的根元素），因为 `put` 函数的 `dragEl` 参数是正在拖拽的 DOM 元素。

**验证标准：**
- 单品库从 API 加载并渲染
- 搜索/筛选功能正常
- 点击"加入搭配"→ 对应槽位显示单品
- 拖拽单品到槽位→ 槽位显示单品
- 拖拽不匹配分类→ 提示错误
- 同分类拖入→ 替换
- 删除槽位单品→ 槽位清空
- 清空按钮→ 所有槽位清空

---

### Phase 4: AI 生成闭环

**依赖：** Phase 3 完成。

**文件清单：**

| 文件 | 变更 |
|------|------|
| `frontend/src/views/OutfitPreview/composables/usePromptBuilder.ts` | 新建 |
| `frontend/src/api/generation.ts` | 新建 |
| `frontend/src/views/OutfitPreview/components/ResultPreview.vue` | 完善 |
| `frontend/src/views/OutfitPreview/components/TopActions.vue` | 完善 — 生成逻辑 |
| `backend/src/generation/generation.module.ts` | 新建 |
| `backend/src/generation/generation.controller.ts` | 新建 |
| `backend/src/generation/generation.service.ts` | 新建 |
| `backend/src/generation/bailian.provider.ts` | 新建 — 百炼 API 调用 |
| `backend/src/app.module.ts` | 更新 — 注册 generation 模块 |

**4A: Prompt Builder** — `usePromptBuilder.ts`

```ts
import type { OutfitSelection } from '@/types/outfit'

export function buildOutfitPrompt(selection: OutfitSelection): string {
  const itemTexts: string[] = []

  Object.values(selection).forEach(value => {
    if (!value) return
    if (Array.isArray(value)) {
      value.forEach(item => itemTexts.push(`${item.color}${item.name}`))
    } else {
      itemTexts.push(`${value.color}${value.name}`)
    }
  })

  return [
    '请生成一张真人模特全身穿搭图。',
    '模特正面站立，全身构图，背景为简洁摄影棚。',
    '真实电商服装展示风格，高清质感。',
    itemTexts.length ? `模特穿着：${itemTexts.join('、')}。` : '',
    '整体风格自然、日常、适合服装搭配预览。'
  ].join('')
}
```

**4B: 前端生成 API** — `generation.ts`

```ts
import { post } from './request'
import type { OutfitSelection } from '@/types/outfit'

interface GenerateResult {
  taskId: string
  status: string
  imageUrl: string
  prompt: string
  isFallback: boolean
}

export function generateOutfitImage(data: { items: OutfitSelection; prompt?: string }) {
  return post<GenerateResult>('/api/generation/outfit', data)
}
```

**4C: 阿里云百炼 API 调用** — `bailian.provider.ts`

> 百炼 API 有新旧两种协议。本计划使用**新协议（wan2.7 系列）**，支持同步调用，更简单可靠。

**API 关键信息（来源：官方文档）：**

| 项 | 值 |
|----|-----|
| 同步端点 | `POST https://{WorkspaceId}.cn-beijing.maas.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation` |
| 异步提交端点 | `POST https://{WorkspaceId}.cn-beijing.maas.aliyuncs.com/api/v1/services/aigc/image-generation/generation` |
| 异步轮询端点 | `GET https://{WorkspaceId}.cn-beijing.maas.aliyuncs.com/api/v1/tasks/{task_id}` |
| 认证 | `Authorization: Bearer sk-xxx` |
| 推荐模型 | `wan2.7-image`（快速）/ `wan2.7-image-pro`（高质量） |
| 图片 URL 有效期 | 24 小时 |
| QPS 限制 | 2 次/秒 |
| 并发任务 | 1 个/账号 |

**新协议请求体（messages 格式）：**
```json
{
  "model": "wan2.7-image",
  "input": {
    "messages": [
      { "role": "user", "content": [{ "text": "prompt text" }] }
    ]
  },
  "parameters": { "size": "1024*1024", "n": 1 }
}
```

**同步响应（直接返回图片 URL）：**
```json
{
  "output": {
    "choices": [{
      "finish_reason": "stop",
      "message": {
        "role": "assistant",
        "content": [{ "image": "https://...oss...aliyuncs.com/xxx.png?Expires=xxx", "type": "image" }]
      }
    }],
    "finished": true
  }
}
```

**完整实现：**

```ts
import { Injectable } from '@nestjs/common'
import 'dotenv/config'

interface GenerateImageInput {
  prompt: string
  referenceImages?: string[]
}

interface GenerateImageOutput {
  imageUrl: string
  isFallback: boolean
  raw?: unknown
}

@Injectable()
export class BailianProvider {
  private readonly apiKey = process.env.BAILIAN_API_KEY || ''
  private readonly workspaceId = process.env.BAILIAN_WORKSPACE_ID || ''
  private readonly model = process.env.BAILIAN_MODEL || 'wan2.7-image'
  private readonly useMock = process.env.AI_IMAGE_USE_MOCK === 'true'

  private get baseUrl(): string {
    return `https://${this.workspaceId}.cn-beijing.maas.aliyuncs.com/api/v1`
  }

  async generate(input: GenerateImageInput): Promise<GenerateImageOutput> {
    // Mock 模式：返回兜底图
    if (this.useMock || !this.apiKey || !this.workspaceId) {
      console.log('[BailianProvider] Using mock/fallback mode')
      return this.getFallbackImage()
    }

    try {
      // 优先使用同步模式（新协议 + 新模型支持）
      return await this.generateSync(input)
    } catch (syncError) {
      console.warn('[BailianProvider] Sync call failed, trying async:', syncError)
      try {
        // 降级到异步模式
        return await this.generateAsync(input)
      } catch (asyncError) {
        console.error('[BailianProvider] Both sync and async failed:', asyncError)
        return this.getFallbackImage()
      }
    }
  }

  /** 同步调用 — 适用于 wan2.7-image / wan2.7-image-pro 等新模型 */
  private async generateSync(input: GenerateImageInput): Promise<GenerateImageOutput> {
    const url = `${this.baseUrl}/services/aigc/multimodal-generation/generation`

    const body: Record<string, unknown> = {
      model: this.model,
      input: {
        messages: [
          {
            role: 'user',
            content: [{ text: input.prompt }],
          },
        ],
      },
      parameters: {
        size: '1024*1024',
        n: 1,
        watermark: false,
      },
    }

    // 如果有参考图片，加入 content
    if (input.referenceImages?.length) {
      const content: Record<string, string>[] = input.referenceImages.map(img => ({ image: img }))
      content.push({ text: input.prompt })
      ;(body.input as Record<string, unknown>).messages = [
        { role: 'user', content },
      ]
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Sync API error ${response.status}: ${errorText}`)
    }

    const result = await response.json()
    const imageUrl = result.output?.choices?.[0]?.message?.content?.[0]?.image

    if (!imageUrl) {
      throw new Error('No image URL in sync response')
    }

    return { imageUrl, isFallback: false, raw: result }
  }

  /** 异步调用 — 提交任务 + 轮询结果 */
  private async generateAsync(input: GenerateImageInput): Promise<GenerateImageOutput> {
    const submitUrl = `${this.baseUrl}/services/aigc/image-generation/generation`

    const body = {
      model: this.model,
      input: {
        messages: [{ role: 'user', content: [{ text: input.prompt }] }],
      },
      parameters: { size: '1024*1024', n: 1 },
    }

    // 提交任务
    const submitRes = await fetch(submitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'X-DashScope-Async': 'enable',
      },
      body: JSON.stringify(body),
    })

    if (!submitRes.ok) {
      throw new Error(`Async submit error ${submitRes.status}`)
    }

    const submitData = await submitRes.json()
    const taskId = submitData.output?.task_id

    if (!taskId) {
      throw new Error('No task_id in async submit response')
    }

    // 轮询结果（最多 30 次，每次 3 秒，总计 90 秒）
    const pollUrl = `${this.baseUrl}/tasks/${taskId}`
    for (let i = 0; i < 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 3000))

      const pollRes = await fetch(pollUrl, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
      })

      if (!pollRes.ok) continue

      const pollData = await pollRes.json()
      const status = pollData.output?.task_status

      if (status === 'SUCCEEDED') {
        const imageUrl =
          pollData.output?.choices?.[0]?.message?.content?.[0]?.image ||
          pollData.output?.results?.[0]?.url  // 兼容旧协议响应格式

        if (imageUrl) {
          return { imageUrl, isFallback: false, raw: pollData }
        }
        break
      }

      if (status === 'FAILED') {
        throw new Error(`Async task failed: ${pollData.code} ${pollData.message}`)
      }
      // PENDING / RUNNING → 继续轮询
    }

    throw new Error('Async polling timeout')
  }

  private getFallbackImage(): GenerateImageOutput {
    const fallbackImages = [
      '/generated/fallback-001.png',
      '/generated/fallback-002.png',
      '/generated/fallback-003.png',
    ]
    return {
      imageUrl: fallbackImages[Math.floor(Math.random() * fallbackImages.length)],
      isFallback: true,
    }
  }
}
```

**环境变量 — `.env.example`（更新）：**
```
# 阿里云百炼 API
BAILIAN_API_KEY=sk-your-api-key-here
BAILIAN_WORKSPACE_ID=your-workspace-id
BAILIAN_MODEL=wan2.7-image

# Mock 模式开关
AI_IMAGE_USE_MOCK=false
```

> **注意：** 百炼返回的图片 URL 有效期仅 24 小时。Demo 演示时建议后端下载图片保存到 `public/generated/` 目录，返回本地路径。生产版本需用 OSS 存储。

**4D: Generation Service & Controller**

```ts
// generation.service.ts
@Injectable()
export class GenerationService {
  constructor(private readonly bailianProvider: BailianProvider) {}

  async generateOutfit(data: { items: Record<string, unknown>; prompt?: string }) {
    const prompt = data.prompt || '请生成一张穿搭效果图'

    const result = await this.bailianProvider.generate({ prompt })

    // 记录任务
    const tasks = readJson<GenerationTask[]>('generation-tasks.json')
    const task: GenerationTask = {
      id: `task_${String(tasks.length + 1).padStart(3, '0')}`,
      prompt,
      imageUrl: result.imageUrl,
      isFallback: result.isFallback,
      createdAt: new Date().toISOString(),
    }
    tasks.push(task)
    writeJson('generation-tasks.json', tasks)

    return {
      code: 0,
      message: result.isFallback ? 'AI 接口暂不可用，已展示预生成 Demo 效果图' : '生成成功',
      data: {
        taskId: task.id,
        status: 'success',
        imageUrl: result.imageUrl,
        prompt,
        isFallback: result.isFallback,
      },
    }
  }
}
```

**4E: 前端生成流程**

TopActions 中的生成按钮逻辑：
```ts
async function handleGenerate() {
  if (!store.hasSelectedItems()) {
    window.$message?.warning('请先选择至少一个单品')
    return
  }

  const prompt = buildOutfitPrompt(store.selectedItems)
  store.currentPrompt = prompt
  store.setGenerating()

  try {
    const result = await generateOutfitImage({
      items: store.selectedItems,
      prompt,
    })
    store.setGenerateSuccess(result.imageUrl, result.isFallback)
    if (result.isFallback) {
      window.$message?.info('当前展示的是预生成 Demo 效果图')
    }
  } catch (error: any) {
    store.setGenerateFailed(error.message || '生成失败，请稍后重试')
  }
}
```

**验证标准：**
- 点击生成→ 右侧显示 loading
- 百炼 API 可用时→ 显示真实生成图
- 百炼 API 不可用时→ 显示兜底图 + 提示
- 生成中按钮禁用，不可重复点击
- 生成失败→ 显示错误信息 + 重新生成按钮

---

### Phase 5: 打磨与兜底

**依赖：** Phase 4 完成。

**文件清单：**

| 文件 | 变更 |
|------|------|
| `backend/data/items.json` | 扩充到 25+ 单品 |
| `backend/public/generated/fallback-*.png` | 添加 3 张兜底图 |
| `backend/public/uploads/*.png` | 添加单品占位图 |
| `frontend/src/views/OutfitPreview/components/ResultPreview.vue` | 优化空状态/错误状态 |
| `frontend/src/views/OutfitPreview/components/OutfitSlot.vue` | 优化空槽位样式 |
| `frontend/src/views/OutfitPreview/components/ItemCard.vue` | 优化拖拽视觉反馈 |
| `frontend/src/views/OutfitPreview/index.vue` | 响应式优化 |
| `README.md` | 新建 — 运行说明 |
| `.gitignore` | 新建/更新 |

**打磨要点：**

1. **空状态优化** — 槽位空时显示虚线边框 + 分类图标 + "拖拽或点击添加"提示
2. **禁用状态** — 生成中所有操作按钮 disabled，单品库不可拖拽
3. **错误提示** — 使用 NaiveUI `useMessage()` 统一提示
4. **兜底图** — 准备 3 张渐变占位 PNG（可用 Node.js 脚本生成或手动创建）
5. **单品图片** — 使用 SVG 占位符（内联 data URI），不依赖外部图片
6. **响应式** — 小屏幕时三栏变单栏（移动端降级体验）

**README.md 内容：**
- 项目介绍
- 技术栈
- 启动方式（前端 + 后端）
- 环境变量说明
- API 接口列表
- Demo 使用流程

**验证标准：**
- 完整演示流程稳定：选单品 → 搭配 → 生成 → 查看结果
- AI 不可用时有兜底图
- 空状态/错误状态友好
- README 可指导新开发者启动

---

## 4. 依赖关系图

```
Phase 0A (前端脚手架) ──┐
                         ├──→ Phase 1 (类型+数据+基础设施) ──┐
Phase 0B (后端脚手架) ──┘                                    │
                                                             ├──→ Phase 3 (交互联调)
Phase 2A (前端静态页面) ──┐                                   │
                          ├──→ Phase 2 完成后 ───────────────┘
Phase 2B (后端 CRUD) ────┘                                    │
                                                              ├──→ Phase 4 (AI 生成)
                                                              │
                                                              ├──→ Phase 5 (打磨)
```

**可并行组：**
- Phase 0A ∥ Phase 0B
- Phase 1A ∥ Phase 1B ∥ Phase 1C
- Phase 2A ∥ Phase 2B
- Phase 5 内部各打磨项可并行

**严格串行：**
- Phase 3 依赖 Phase 2 两端都完成
- Phase 4 依赖 Phase 3
- Phase 5 依赖 Phase 4

---

## 5. 错误处理与兜底方案

| 场景 | 处理方式 |
|------|---------|
| 百炼 API Key 无效/未配置 | 后端检测 `!apiKey \|\| !workspaceId` → 直接使用兜底图 + `isFallback: true` |
| 百炼 API 返回 401/403 | 后端捕获 → 降级返回兜底图 |
| 百炼 API 返回 429（限流） | 后端捕获 → 降级返回兜底图 + 提示"AI 服务繁忙" |
| 百炼同步调用超时/失败 | 后端自动降级到异步模式，异步也失败则返回兜底图 |
| 百炼异步轮询超时（90s） | 后端终止轮询 → 返回兜底图 |
| 百炼图片 URL 过期（24h） | Demo 中即时展示；后续可下载保存到 `public/generated/` |
| 后端未启动 | 前端 Fetch 捕获网络错误 → 显示"服务连接失败" |
| items.json 为空 | 后端返回空数组，前端显示"暂无单品" |
| 单品图片 404 | ItemCard 使用 CSS 渐变占位 + 首字母缩写 |
| 生成图 404 | ResultPreview 显示"图片加载失败" + 重新生成按钮 |
| 保存失败 | 前端 catch 错误 → 提示"保存失败，请重试" |

---

## 6. 技术要点速查

### 6.1 阿里云百炼 API 调用（Fetch API）

**推荐模型：** `wan2.7-image`（快速）/ `wan2.7-image-pro`（高质量，4K，色彩控制）

**同步调用（推荐，新协议）：**
```
端点: POST https://{WorkspaceId}.cn-beijing.maas.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation
认证: Authorization: Bearer sk-xxx
Content-Type: application/json

请求体（messages 格式）:
{
  "model": "wan2.7-image",
  "input": {
    "messages": [
      { "role": "user", "content": [{ "text": "prompt text" }] }
    ]
  },
  "parameters": { "size": "1024*1024", "n": 1, "watermark": false }
}

同步响应:
output.choices[0].message.content[0].image → 图片 URL（PNG，24小时有效）
```

**异步调用（备选，旧协议兼容）：**
```
提交: POST .../api/v1/services/aigc/image-generation/generation
      Header: X-DashScope-Async: enable
轮询: GET .../api/v1/tasks/{task_id}

异步提交响应: output.task_id
异步轮询响应: output.task_status = PENDING → RUNNING → SUCCEEDED / FAILED
成功: output.choices[0].message.content[0].image → 图片 URL
```

**关键约束：**
- 图片 URL 有效期 24 小时（Demo 中需下载保存或即时展示）
- QPS 限制：2 次/秒
- 并发任务：1 个/账号
- 新用户免费额度：500 张（90 天有效）
- API Key 格式：`sk-xxx`
- WorkspaceId 在百炼控制台获取

### 6.2 拖拽实现

- 库：`vue-draggable-plus`
- 导入：`import { VueDraggable, type DraggableEvent } from 'vue-draggable-plus'`
- 模式：`VueDraggable` 组件模式（推荐，最直观）
- 源端 Group：`{ name: 'outfit-items', pull: 'clone', put: false }`
- 目标端 Group：`{ name: 'outfit-items', put: (to, from, dragEl) => dragEl.dataset.category === slot.acceptCategory }`
- 分类校验：通过 `put` 函数读取 `dragEl.dataset.category`，不匹配返回 `false`
- 事件：`@add(e: DraggableEvent<T>)` — `e.data` 为拖入的响应式数据
- `data-category` 必须绑定在 VueDraggable 直接子元素 DOM 上

### 6.3 Pinia Store 设计

- 使用 Composition API 风格 (`defineStore('name', () => {...})`)
- `selectedItems` 用 `reactive<OutfitSelection>({})` — 直接修改属性
- `generateStatus` / `resultImageUrl` 用 `ref`
- `addItem` / `removeItem` / `clearOutfit` 为 actions
- `hasSelectedItems` 为方法（非 getter，避免不必要的响应式追踪）

### 6.4 类型定义

- 集中在 `frontend/src/types/outfit.ts`
- 后端 `backend/src/common/types.ts` 镜像（保持字段一致）
- `ClothingCategory` 为联合类型
- `OutfitSelection` 为可选字段接口（accessory 为数组）
- `SlotDefinition` 驱动搭配区渲染

### 6.5 样式方案

- CSS Variables 定义在 `variables.scss`
- 主色：蓝灰调 `#4f6d7a`（非强制绿色）
- 面板：白色 + 浅灰背景 + 细边框
- 圆角：6/10/14px 三级
- NaiveUI 组件主题通过 `n-config-provider` 覆盖 primaryColor
- 不使用 UnoCSS — 纯 SCSS + CSS Variables 足够

---

## 7. 预估工作量

| 阶段 | 文件数 | 预估时间 | 并行机会 |
|------|--------|---------|---------|
| Phase 0 | 12 | 30min | 前后端并行 |
| Phase 1 | 8 | 45min | 三组并行 |
| Phase 2 | 14 | 90min | 前后端并行 |
| Phase 3 | 8 | 60min | 串行 |
| Phase 4 | 9 | 90min | 串行 |
| Phase 5 | 8+ | 45min | 多项并行 |
| **合计** | **~59** | **~6h** | — |

---

## 8. 执行建议

1. **按阶段顺序执行**，每个阶段完成后运行验证标准
2. **Phase 0-1 可合并执行**（脚手架 + 基础设施一步到位）
3. **Phase 2 是关键路径** — 前后端并行可节省 50% 时间
4. **Phase 4 百炼集成** — 先用 `AI_IMAGE_USE_MOCK=true` 开发，确认流程后再切真实 API
5. **兜底图优先** — 即使百炼 API 未配置，Demo 也应能完整演示
