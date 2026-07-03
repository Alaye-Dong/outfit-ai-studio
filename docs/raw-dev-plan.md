下面是一份可以直接交给开发 LLM 执行的 **Vue 技术栈 AI 穿搭搭配 Demo 开发文档**。目标是让开发 LLM 能按文档直接生成项目结构、页面、组件、接口和基础逻辑。

---

# AI 穿搭搭配工具 Demo 开发文档

## 1. 项目概述

### 1.1 项目名称

AI Outfit Preview Demo
中文名：AI 穿搭预演工具 Demo

### 1.2 项目目标

开发一个简易 AI 穿搭搭配工具 Demo，实现以下核心流程：

```text
单品库选择服装
↓
拖拽到搭配区组合成一套穿搭
↓
点击生成
↓
调用 AI 图像生成接口
↓
在成果展示区展示穿搭效果图
```

本项目是 **Demo 验证版本**，重点是完成可演示闭环，不追求完整商品管理系统和精准虚拟试衣能力。

### 1.3 核心页面结构

页面采用三栏布局：

```text
左侧：单品库区
中间：拖拽搭配区
右侧：穿搭成果展示区
```

参考布局：

```text
┌────────────────────┬──────────────────────────────┬────────────────────┐
│      单品库区       │         拖拽搭配区             │    成果展示区       │
│  商品搜索/筛选       │   上衣/下装/外套/鞋/配饰槽位    │   AI 生成效果图     │
│  商品卡片列表        │   清空/保存/生成按钮            │   loading/失败状态  │
└────────────────────┴──────────────────────────────┴────────────────────┘
```

---

# 2. 技术栈要求

## 2.1 前端技术栈

推荐使用：

```text
Vue 3
Vite
TypeScript
Vue Router
Pinia
Naive UI
Vue Draggable Plus
Axios
```

说明：

| 模块     | 技术                 | 用途          |
| ------ | ------------------ | ----------- |
| 前端框架   | Vue 3              | 页面与组件开发     |
| 构建工具   | Vite               | 快速开发与打包     |
| 类型系统   | TypeScript         | 提升代码可靠性     |
| UI 组件库 | Naive UI           | 表单、按钮、卡片、弹窗 |
| 状态管理   | Pinia              | 管理当前搭配状态    |
| 拖拽库    | Vue Draggable Plus | 实现单品拖拽      |
| 请求库    | Axios              | 调用后端接口      |
| 样式     | UnoCSS | 页面样式        |

## 2.2 后端技术栈

Demo 版本推荐使用：

```text
Node.js
NestJS
TypeScript
```

后端主要负责：

```text
1. 返回单品列表
2. 保存搭配数据
3. 代理调用 AI 图像生成接口
4. 返回生成结果
```

## 2.3 数据存储

Demo 第一版可以使用本地 JSON 文件，不强制接数据库。

推荐优先级：

```text
第一版 Demo：本地 JSON 文件
增强 Demo：SQLite
产品化版本：PostgreSQL
```

本开发文档按 **本地 JSON 文件 + 本地图片目录** 设计，方便快速实现。

---

# 3. 项目目录结构

建议使用前后端分离结构：

```text
ai-outfit-preview-demo/
├─ frontend/
│  ├─ package.json
│  ├─ vite.config.ts
│  ├─ index.html
│  └─ src/
│     ├─ main.ts
│     ├─ App.vue
│     ├─ router/
│     │  └─ index.ts
│     ├─ stores/
│     │  └─ outfit.ts
│     ├─ api/
│     │  ├─ request.ts
│     │  ├─ items.ts
│     │  ├─ outfits.ts
│     │  └─ generation.ts
│     ├─ types/
│     │  └─ outfit.ts
│     ├─ views/
│     │  └─ OutfitPreview/
│     │     ├─ index.vue
│     │     ├─ components/
│     │     │  ├─ ItemLibrary.vue
│     │     │  ├─ ItemCard.vue
│     │     │  ├─ OutfitCanvas.vue
│     │     │  ├─ OutfitSlot.vue
│     │     │  ├─ ResultPreview.vue
│     │     │  └─ TopActions.vue
│     │     └─ composables/
│     │        ├─ useItemFilter.ts
│     │        └─ usePromptBuilder.ts
│     └─ styles/
│        ├─ variables.scss
│        └─ global.scss
│
├─ backend/
│  ├─ package.json
│  ├─ nest-cli.json
│  ├─ src/
│  │  ├─ main.ts
│  │  ├─ app.module.ts
│  │  ├─ items/
│  │  │  ├─ items.module.ts
│  │  │  ├─ items.controller.ts
│  │  │  └─ items.service.ts
│  │  ├─ outfits/
│  │  │  ├─ outfits.module.ts
│  │  │  ├─ outfits.controller.ts
│  │  │  └─ outfits.service.ts
│  │  ├─ generation/
│  │  │  ├─ generation.module.ts
│  │  │  ├─ generation.controller.ts
│  │  │  ├─ generation.service.ts
│  │  │  └─ ai-image.provider.ts
│  │  └─ common/
│  │     └─ file-db.ts
│  ├─ data/
│  │  ├─ items.json
│  │  ├─ outfits.json
│  │  └─ generation-tasks.json
│  └─ public/
│     ├─ uploads/
│     └─ generated/
│
└─ docker-compose.yml
```

---

# 4. 页面功能设计

## 4.1 页面总体布局

主页面路径：

```text
/outfit-preview
```

主页面组件：

```text
src/views/OutfitPreview/index.vue
```

页面结构：

```vue
<template>
  <div class="outfit-preview-page">
    <header class="page-header">
      <div>
        <div class="page-subtitle">OUTFIT PREVIEW</div>
        <h1>AI 穿搭预演工具</h1>
      </div>

      <TopActions />
    </header>

    <main class="page-main">
      <aside class="left-panel">
        <ItemLibrary />
      </aside>

      <section class="center-panel">
        <OutfitCanvas />
      </section>

      <aside class="right-panel">
        <ResultPreview />
      </aside>
    </main>
  </div>
</template>
```

布局要求：

```text
页面高度：100vh
左侧宽度：320px
中间区域：自适应
右侧宽度：320px
整体背景：浅灰绿色或浅灰色
卡片背景：白色
区域之间留 16px 间距
```

---

# 5. 单品库区设计

## 5.1 功能说明

单品库区负责展示服装单品，并提供搜索、筛选、拖拽、加入搭配等操作。

必须实现：

```text
1. 单品列表展示
2. 分类筛选
3. 搜索
4. 季节筛选
5. 场合筛选
6. 点击“加入搭配”
7. 拖拽单品到搭配区
```

可选实现：

```text
1. 新增单品
2. 编辑单品
3. 上传图片
```

Demo 第一版可以先不做完整上传，只使用预置数据。

## 5.2 单品分类

分类枚举：

```ts
export type ClothingCategory =
  | 'top'
  | 'bottom'
  | 'dress'
  | 'outerwear'
  | 'shoes'
  | 'bag'
  | 'accessory'
```

中文显示：

```ts
export const categoryLabelMap = {
  top: '上衣',
  bottom: '下装',
  dress: '连衣裙',
  outerwear: '外套',
  shoes: '鞋',
  bag: '包',
  accessory: '配饰'
}
```

## 5.3 单品数据结构

```ts
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
```

示例：

```json
{
  "id": "item_001",
  "name": "棕色格纹夹克",
  "category": "outerwear",
  "color": "棕色",
  "season": ["秋季", "冬季"],
  "occasion": ["日常", "通勤"],
  "imageUrl": "/uploads/plaid-jacket.png",
  "note": "宽松版型，复古风格"
}
```

## 5.4 单品卡片展示内容

每个单品卡片展示：

```text
单品图片
单品名称
颜色标签
分类标签
季节标签
加入搭配按钮
编辑按钮，可选
```

卡片交互：

```text
点击“加入搭配”：添加到对应搭配槽位
拖拽卡片：拖到中间搭配区
```

## 5.5 单品库组件

组件路径：

```text
src/views/OutfitPreview/components/ItemLibrary.vue
```

职责：

```text
1. 调用 GET /api/items 获取单品列表
2. 管理搜索关键词
3. 管理分类筛选
4. 管理季节筛选
5. 管理场合筛选
6. 渲染 ItemCard
```

---

# 6. 拖拽搭配区设计

## 6.1 设计原则

搭配区不要做自由画布，第一版使用 **固定槽位式搭配区**。

原因：

```text
1. 实现更简单
2. 业务逻辑更清晰
3. 更容易生成 AI Prompt
4. 更适合 Demo 稳定演示
```

## 6.2 搭配槽位

中间区域包含以下槽位：

```text
外套
上衣
下装
连衣裙
鞋
包
配饰
```

布局建议：

```text
左上：外套
中上：上衣
右上：配饰
左中：包
中中：连衣裙
中下：下装
下方：鞋
```

也可以使用 CSS Grid：

```text
grid-template-columns: repeat(3, 1fr)
grid-auto-rows: 220px
gap: 16px
```

## 6.3 搭配数据结构

```ts
export interface OutfitSelection {
  outerwear?: ClothingItem
  top?: ClothingItem
  bottom?: ClothingItem
  dress?: ClothingItem
  shoes?: ClothingItem
  bag?: ClothingItem
  accessory?: ClothingItem[]
}
```

说明：

```text
outerwear、top、bottom、dress、shoes、bag 每类默认只放一个
accessory 可以放多个
```

## 6.4 槽位规则

| 槽位  | 可接受品类     | 数量 |
| --- | --------- | -- |
| 外套  | outerwear | 1  |
| 上衣  | top       | 1  |
| 下装  | bottom    | 1  |
| 连衣裙 | dress     | 1  |
| 鞋   | shoes     | 1  |
| 包   | bag       | 1  |
| 配饰  | accessory | 多个 |

如果用户把不匹配的单品拖到槽位：

```text
显示提示：该单品不能放入当前区域
不更新搭配状态
```

如果用户把同品类新单品拖入已有槽位：

```text
替换原有单品
```

## 6.5 搭配区操作按钮

搭配区顶部按钮：

```text
清空
保存套装
生成效果图
```

按钮逻辑：

### 清空

```text
清空当前 Pinia 中的 selectedItems
清空 resultImageUrl
generateStatus 重置为 idle
```

### 保存套装

```text
调用 POST /api/outfits
保存当前搭配组合
如果没有选择任何单品，则提示：请先选择单品
```

### 生成效果图

```text
调用 POST /api/generation/outfit
传入当前搭配组合
生成中展示 loading
成功后将 resultImageUrl 写入状态
失败后展示错误信息
```

---

# 7. 成果展示区设计

## 7.1 功能说明

成果展示区展示当前搭配的 AI 生成结果。

需要支持以下状态：

```text
idle：未生成
generating：生成中
success：生成成功
failed：生成失败
```

## 7.2 状态展示

### idle

展示默认占位：

```text
暂无生成结果
请先选择单品并点击“生成效果图”
```

也可以展示默认模特图。

### generating

展示：

```text
AI 正在生成穿搭效果图...
Loading 动画
```

### success

展示：

```text
生成后的穿搭效果图
重新生成按钮
保存结果按钮，可选
```

### failed

展示：

```text
生成失败
错误信息
重新生成按钮
```

## 7.3 兜底机制

Demo 演示时 AI 接口可能失败或耗时过长，因此必须支持兜底图。

后端生成失败时，可以返回：

```json
{
  "status": "success",
  "imageUrl": "/generated/fallback-001.png",
  "isFallback": true,
  "message": "AI 接口暂不可用，已展示预生成效果图"
}
```

前端如果收到 `isFallback: true`，可以轻提示：

```text
当前展示的是预生成 Demo 效果图
```

---

# 8. Pinia 状态管理设计

文件：

```text
src/stores/outfit.ts
```

## 8.1 State

```ts
import { defineStore } from 'pinia'
import type { ClothingItem, ClothingCategory, OutfitSelection } from '@/types/outfit'

export const useOutfitStore = defineStore('outfit', {
  state: () => ({
    selectedItems: {} as OutfitSelection,
    resultImageUrl: '',
    generateStatus: 'idle' as 'idle' | 'generating' | 'success' | 'failed',
    generateError: '',
    currentPrompt: ''
  }),

  actions: {
    addItem(item: ClothingItem) {},
    removeItem(category: ClothingCategory, itemId?: string) {},
    clearOutfit() {},
    setGenerating() {},
    setGenerateSuccess(imageUrl: string) {},
    setGenerateFailed(error: string) {},
    setPrompt(prompt: string) {}
  }
})
```

## 8.2 addItem 规则

```ts
addItem(item: ClothingItem) {
  if (item.category === 'accessory') {
    if (!this.selectedItems.accessory) {
      this.selectedItems.accessory = []
    }

    const exists = this.selectedItems.accessory.some(i => i.id === item.id)
    if (!exists) {
      this.selectedItems.accessory.push(item)
    }

    return
  }

  this.selectedItems[item.category] = item
}
```

## 8.3 clearOutfit 规则

```ts
clearOutfit() {
  this.selectedItems = {}
  this.resultImageUrl = ''
  this.generateStatus = 'idle'
  this.generateError = ''
  this.currentPrompt = ''
}
```

---

# 9. Prompt 生成逻辑

文件：

```text
src/views/OutfitPreview/composables/usePromptBuilder.ts
```

## 9.1 Prompt 生成目标

根据当前搭配生成适合图像生成模型的文本描述。

输入：

```ts
OutfitSelection
```

输出：

```ts
string
```

## 9.2 Prompt 规则

基础 Prompt：

```text
请生成一张真人模特全身穿搭图，模特正面站立，全身构图，背景为简洁摄影棚，真实电商服装展示风格，高清质感。
```

根据单品追加：

```text
模特穿着：棕色格纹夹克、白色针织上衣、灰色长款半身裙、黑色厚底鞋。
```

完整示例：

```text
请生成一张真人模特全身穿搭图，模特正面站立，全身构图，背景为简洁摄影棚，真实电商服装展示风格，高清质感。模特穿着棕色格纹夹克、白色针织上衣、灰色长款半身裙和黑色厚底鞋。整体风格自然、日常、适合秋冬通勤穿搭。
```

英文 Prompt 可选：

```text
A full-body realistic fashion model standing front-facing in a minimal studio background. The model is wearing a brown plaid jacket, a white knit top, a grey long skirt, and black chunky shoes. High quality commercial fashion photography, realistic fabric texture, clean composition.
```

## 9.3 Prompt Builder 示例逻辑

```ts
export function buildOutfitPrompt(selection: OutfitSelection) {
  const itemTexts: string[] = []

  Object.values(selection).forEach(value => {
    if (!value) return

    if (Array.isArray(value)) {
      value.forEach(item => {
        itemTexts.push(`${item.color}${item.name}`)
      })
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

---

# 10. 前端 API 设计

## 10.1 Axios 实例

文件：

```text
src/api/request.ts
```

要求：

```text
baseURL 从环境变量 VITE_API_BASE_URL 读取
默认值：http://localhost:3000
请求超时：60000ms
统一处理错误
```

## 10.2 单品接口

文件：

```text
src/api/items.ts
```

```ts
export function getItems(params?: {
  keyword?: string
  category?: string
  season?: string
  occasion?: string
}) {
  return request.get('/api/items', { params })
}
```

## 10.3 搭配接口

文件：

```text
src/api/outfits.ts
```

```ts
export function saveOutfit(data: {
  name: string
  items: OutfitSelection
}) {
  return request.post('/api/outfits', data)
}
```

## 10.4 生成接口

文件：

```text
src/api/generation.ts
```

```ts
export function generateOutfitImage(data: {
  items: OutfitSelection
  prompt?: string
}) {
  return request.post('/api/generation/outfit', data)
}
```

---

# 11. 后端接口设计

## 11.1 基础地址

```text
http://localhost:3000
```

所有接口统一以 `/api` 开头。

---

## 11.2 获取单品列表

### Endpoint

```http
GET /api/items
```

### Query 参数

| 参数       | 类型     | 必填 | 说明         |
| -------- | ------ | -- | ---------- |
| keyword  | string | 否  | 搜索名称、颜色、备注 |
| category | string | 否  | 分类         |
| season   | string | 否  | 季节         |
| occasion | string | 否  | 场合         |

### Response

```json
{
  "code": 0,
  "message": "ok",
  "data": [
    {
      "id": "item_001",
      "name": "棕色格纹夹克",
      "category": "outerwear",
      "color": "棕色",
      "season": ["秋季", "冬季"],
      "occasion": ["日常", "通勤"],
      "imageUrl": "/uploads/plaid-jacket.png",
      "note": "宽松版型，复古风格"
    }
  ]
}
```

---

## 11.3 保存搭配

### Endpoint

```http
POST /api/outfits
```

### Request

```json
{
  "name": "秋冬通勤搭配",
  "items": {
    "outerwear": {
      "id": "item_001",
      "name": "棕色格纹夹克",
      "category": "outerwear",
      "color": "棕色",
      "season": ["秋季", "冬季"],
      "occasion": ["日常", "通勤"],
      "imageUrl": "/uploads/plaid-jacket.png"
    },
    "bottom": {
      "id": "item_002",
      "name": "灰色长款半身裙",
      "category": "bottom",
      "color": "灰色",
      "season": ["春季", "秋季"],
      "occasion": ["日常", "通勤"],
      "imageUrl": "/uploads/grey-skirt.png"
    }
  }
}
```

### Response

```json
{
  "code": 0,
  "message": "保存成功",
  "data": {
    "id": "outfit_001",
    "name": "秋冬通勤搭配",
    "createdAt": "2026-07-03T12:00:00.000Z"
  }
}
```

---

## 11.4 AI 生成穿搭图

### Endpoint

```http
POST /api/generation/outfit
```

### Request

```json
{
  "items": {
    "outerwear": {
      "id": "item_001",
      "name": "棕色格纹夹克",
      "category": "outerwear",
      "color": "棕色",
      "imageUrl": "/uploads/plaid-jacket.png"
    },
    "bottom": {
      "id": "item_002",
      "name": "灰色长款半身裙",
      "category": "bottom",
      "color": "灰色",
      "imageUrl": "/uploads/grey-skirt.png"
    },
    "shoes": {
      "id": "item_003",
      "name": "黑色厚底鞋",
      "category": "shoes",
      "color": "黑色",
      "imageUrl": "/uploads/black-shoes.png"
    }
  },
  "prompt": "请生成一张真人模特全身穿搭图..."
}
```

### Response 成功

```json
{
  "code": 0,
  "message": "生成成功",
  "data": {
    "taskId": "task_001",
    "status": "success",
    "imageUrl": "/generated/outfit-task-001.png",
    "prompt": "请生成一张真人模特全身穿搭图...",
    "isFallback": false
  }
}
```

### Response 兜底成功

```json
{
  "code": 0,
  "message": "AI 接口暂不可用，已展示预生成 Demo 效果图",
  "data": {
    "taskId": "task_001",
    "status": "success",
    "imageUrl": "/generated/fallback-001.png",
    "prompt": "请生成一张真人模特全身穿搭图...",
    "isFallback": true
  }
}
```

### Response 失败

```json
{
  "code": 500,
  "message": "生成失败，请稍后重试",
  "data": null
}
```

---

# 12. 后端 AI 图像接口封装

## 12.1 设计原则

前端不能直接调用 AI 图像生成接口。

原因：

```text
1. 避免暴露 API Key
2. 方便切换不同 AI 服务商
3. 方便处理失败重试
4. 方便增加兜底图
```

## 12.2 AI Provider 抽象

文件：

```text
backend/src/generation/ai-image.provider.ts
```

定义统一方法：

```ts
export interface GenerateImageInput {
  prompt: string
  referenceImages?: string[]
}

export interface GenerateImageOutput {
  imageUrl: string
  raw?: unknown
}

export class AiImageProvider {
  async generate(input: GenerateImageInput): Promise<GenerateImageOutput> {
    // TODO: 对接真实 AI 图像生成接口
  }
}
```

## 12.3 Demo Mock 模式

在没有真实 AI 接口时，先返回预置图：

```ts
const fallbackImages = [
  '/generated/fallback-001.png',
  '/generated/fallback-002.png',
  '/generated/fallback-003.png'
]

return {
  imageUrl: fallbackImages[Math.floor(Math.random() * fallbackImages.length)]
}
```

## 12.4 真实接口模式

后续接入真实图像生成接口时，只需要替换 `AiImageProvider.generate()` 内部逻辑。

环境变量示例：

```env
AI_IMAGE_API_KEY=your_api_key
AI_IMAGE_API_URL=https://example.com/v1/images/generations
AI_IMAGE_MODEL=xxx-image-model
AI_IMAGE_USE_MOCK=true
```

当：

```text
AI_IMAGE_USE_MOCK=true
```

使用本地兜底图。

当：

```text
AI_IMAGE_USE_MOCK=false
```

调用真实 AI 接口。

---

# 13. Mock 数据

文件：

```text
backend/data/items.json
```

建议预置 20～30 个单品。

示例：

```json
[
  {
    "id": "item_001",
    "name": "棕色格纹夹克",
    "category": "outerwear",
    "color": "棕色",
    "season": ["秋季", "冬季"],
    "occasion": ["日常", "通勤"],
    "imageUrl": "/uploads/plaid-jacket.png",
    "note": "复古格纹，宽松版型"
  },
  {
    "id": "item_002",
    "name": "灰色长款半身裙",
    "category": "bottom",
    "color": "灰色",
    "season": ["春季", "秋季"],
    "occasion": ["日常", "通勤"],
    "imageUrl": "/uploads/grey-skirt.png",
    "note": "长款垂坠感半裙"
  },
  {
    "id": "item_003",
    "name": "黑色厚底鞋",
    "category": "shoes",
    "color": "黑色",
    "season": ["春季", "秋季", "冬季"],
    "occasion": ["日常", "街头"],
    "imageUrl": "/uploads/black-shoes.png",
    "note": "黑色厚底休闲鞋"
  },
  {
    "id": "item_004",
    "name": "红色棉服外套",
    "category": "outerwear",
    "color": "红色",
    "season": ["冬季"],
    "occasion": ["日常", "户外"],
    "imageUrl": "/uploads/red-puffer.png",
    "note": "短款棉服"
  },
  {
    "id": "item_005",
    "name": "白色针织上衣",
    "category": "top",
    "color": "白色",
    "season": ["秋季", "冬季"],
    "occasion": ["日常", "通勤"],
    "imageUrl": "/uploads/white-knit-top.png",
    "note": "基础款针织内搭"
  }
]
```

---

# 14. 样式要求

## 14.1 页面整体风格

参考截图风格：

```text
浅色背景
三栏布局
卡片化
边框圆角
低饱和绿色作为主色
按钮简洁
图片区留白充足
```

## 14.2 推荐颜色

```scss
:root {
  --color-primary: #0f766e;
  --color-primary-light: #ccfbf1;
  --color-bg: #eef5f3;
  --color-panel: #ffffff;
  --color-border: #d9e5e1;
  --color-text: #1f2937;
  --color-muted: #6b7280;
}
```

## 14.3 主布局样式

```scss
.outfit-preview-page {
  height: 100vh;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
}

.page-header {
  height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-main {
  flex: 1;
  display: grid;
  grid-template-columns: 320px minmax(600px, 1fr) 320px;
  gap: 16px;
  padding: 0 16px 16px;
  overflow: hidden;
}

.left-panel,
.center-panel,
.right-panel {
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
}
```

---

# 15. 交互细节

## 15.1 添加单品

用户可通过两种方式添加：

```text
1. 点击单品卡片中的“加入搭配”
2. 拖拽单品到中间搭配区
```

添加逻辑：

```text
识别 item.category
放入对应 slot
如果该 slot 已有单品，则替换
如果是 accessory，则追加
```

## 15.2 删除单品

每个搭配槽位中的单品右上角显示删除按钮。

点击后：

```text
从 selectedItems 中移除该单品
```

## 15.3 清空搭配

点击清空：

```text
弹出确认框
确认后清空 selectedItems 和 resultImageUrl
```

## 15.4 保存套装

点击保存套装：

```text
如果没有选择单品，提示“请先选择单品”
否则弹窗输入套装名称
调用 POST /api/outfits
保存成功后提示“保存成功”
```

## 15.5 生成效果图

点击生成效果图：

```text
如果没有选择单品，提示“请先选择单品”
否则：
1. 生成 Prompt
2. generateStatus = generating
3. 调用 POST /api/generation/outfit
4. 成功后 resultImageUrl = response.data.imageUrl
5. generateStatus = success
6. 失败后 generateStatus = failed
```

## 15.6 加载状态

生成过程中：

```text
生成按钮 disabled
成果展示区显示 loading
不允许重复点击生成
```

---

# 16. 校验规则

## 16.1 生成前校验

至少选择一个单品才允许生成。

推荐校验：

```ts
function hasSelectedItems(selection: OutfitSelection) {
  return Object.values(selection).some(value => {
    if (Array.isArray(value)) return value.length > 0
    return Boolean(value)
  })
}
```

如果没有单品：

```text
提示：请先选择至少一个单品
```

## 16.2 保存前校验

保存套装时：

```text
必须至少选择一个单品
套装名称不能为空
```

## 16.3 拖拽校验

如果拖入不匹配槽位：

```text
提示：该单品不能放入当前区域
```

---

# 17. 开发任务拆分

## 17.1 阶段一：项目初始化

### 前端

```text
1. 创建 Vite + Vue 3 + TypeScript 项目
2. 安装 Naive UI
3. 安装 Pinia
4. 安装 Vue Router
5. 安装 Axios
6. 安装 Vue Draggable Plus
7. 配置路径别名 @
8. 配置全局样式
```

### 后端

```text
1. 创建 NestJS 项目
2. 开启 CORS
3. 配置静态资源目录 public
4. 创建 items、outfits、generation 模块
5. 创建 data 目录和 JSON 文件
```

---

## 17.2 阶段二：前端静态页面

完成：

```text
1. 三栏布局
2. 顶部标题和操作按钮
3. 单品库静态卡片
4. 搭配槽位 UI
5. 成果展示区 UI
```

验收标准：

```text
页面视觉接近参考图
三栏区域清晰
不同区域可滚动
```

---

## 17.3 阶段三：单品数据接口

完成：

```text
1. 后端 GET /api/items
2. 前端 getItems
3. 单品库渲染接口数据
4. 搜索和筛选
```

验收标准：

```text
可以看到后端返回的单品列表
可以按分类筛选
可以按关键词搜索
```

---

## 17.4 阶段四：搭配状态与拖拽

完成：

```text
1. Pinia outfit store
2. 点击加入搭配
3. 拖拽加入搭配
4. 删除搭配单品
5. 清空搭配
```

验收标准：

```text
从左侧选择单品后，中间搭配区对应槽位显示该单品
替换和删除逻辑正常
清空按钮正常
```

---

## 17.5 阶段五：AI 生成接口

完成：

```text
1. 前端生成 Prompt
2. 后端 POST /api/generation/outfit
3. 后端 mock 返回兜底图
4. 前端展示 loading
5. 前端展示结果图
6. 前端处理失败状态
```

验收标准：

```text
点击生成效果图后，右侧展示生成图
生成中有 loading
失败时有错误提示
```

---

## 17.6 阶段六：保存套装

完成：

```text
1. 后端 POST /api/outfits
2. 保存到 backend/data/outfits.json
3. 前端弹窗输入套装名称
4. 保存成功提示
```

验收标准：

```text
当前搭配可以保存
outfits.json 中可以看到保存记录
```

---

## 17.7 阶段七：Demo 打磨

完成：

```text
1. 预置 20～30 个单品
2. 预置 3～5 张 fallback 生成图
3. 优化空状态
4. 优化按钮禁用状态
5. 优化错误提示
6. 优化响应式布局
```

验收标准：

```text
演示流程稳定
页面视觉完整
AI 接口不可用时仍有兜底结果图
```

---

# 18. 验收标准

## 18.1 功能验收

必须满足：

```text
1. 页面包含单品库区、拖拽搭配区、成果展示区
2. 单品库能展示服装单品
3. 单品支持搜索和分类筛选
4. 单品能加入搭配区
5. 单品能拖拽到搭配区
6. 搭配区能删除和清空单品
7. 能根据当前搭配生成 Prompt
8. 能调用后端生成接口
9. 成果展示区能展示生成图
10. AI 失败时有兜底图或错误提示
```

## 18.2 体验验收

需要满足：

```text
1. 页面布局接近参考图
2. 操作链路清晰
3. 生成过程中有 loading
4. 不能重复点击生成
5. 没有选择单品时不能生成
6. 错误提示友好
```

## 18.3 代码验收

需要满足：

```text
1. 使用 Vue 3 Composition API
2. 使用 TypeScript
3. 组件拆分清晰
4. API 调用集中在 src/api
5. 状态管理集中在 Pinia
6. 类型定义集中在 src/types
7. 后端模块按 items / outfits / generation 拆分
```

---

# 19. 推荐开发顺序

开发 LLM 应按以下顺序实现：

```text
1. 创建前端项目和后端项目
2. 搭建主页面三栏布局
3. 创建类型定义
4. 创建 mock items.json
5. 实现后端 GET /api/items
6. 实现前端单品库
7. 实现 Pinia 搭配状态
8. 实现点击加入搭配
9. 实现拖拽加入搭配
10. 实现搭配区删除和清空
11. 实现 Prompt Builder
12. 实现后端 generation mock 接口
13. 实现前端生成效果图
14. 实现保存套装
15. 补充兜底图和演示数据
16. 打磨样式和交互
```

---

# 20. 非目标范围

Demo 第一版不需要实现：

```text
1. 用户登录
2. 权限管理
3. 真实商品库存管理
4. 批量导入商品
5. 精准虚拟试衣
6. 人体姿态识别
7. 服装分割
8. 自动抠图
9. 多模特管理
10. 复杂生成历史管理
11. 多租户
12. 复杂后台管理系统
```

这些功能可以作为后续产品化阶段扩展。

---

# 21. 后续产品化扩展方向

Demo 完成后，可以逐步扩展：

```text
1. 接入真实商品库
2. 支持商品图片上传
3. 支持 MinIO / S3 对象存储
4. 使用 PostgreSQL 存储商品、搭配和生成记录
5. 引入 Redis + BullMQ 处理异步生成任务
6. 支持多模特选择
7. 支持多种风格：电商图、街拍图、棚拍图、社媒图
8. 支持参考图生成
9. 支持 AI 虚拟试衣模型
10. 支持生成历史和结果复用
```

---

# 22. 最终交付物

开发完成后应交付：

```text
1. frontend Vue 3 项目
2. backend NestJS 项目
3. 可运行的本地 Demo
4. mock 单品数据
5. fallback 生成图片
6. README 运行说明
7. .env.example
8. docker-compose.yml，可选
```

README 至少包含：

```text
1. 项目介绍
2. 技术栈
3. 启动方式
4. 环境变量
5. 接口说明
6. Demo 使用流程
```

---

# 23. 一句话实现目标

本 Demo 要实现的是：

> 用户从左侧单品库选择或拖拽服装单品，在中间搭配区组合成一套穿搭，点击生成后由后端代理调用 AI 图像生成接口，并在右侧成果区展示最终穿搭效果图。第一版以流程闭环和演示稳定性为优先，不追求精准虚拟试衣。
