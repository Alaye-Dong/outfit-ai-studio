# AI 穿搭预演工具 Demo

一个简易的 AI 穿搭搭配工具 Demo，支持从单品库选择服装、拖拽搭配、AI 生成穿搭效果图。

## 功能特性

- **单品库区**：展示服装单品，支持搜索和分类筛选
- **拖拽搭配区**：固定槽位式搭配，支持拖拽和点击添加
- **穿搭成果展示区**：展示 AI 生成的穿搭效果图
- **AI 图像生成**：对接阿里云百炼 API，生成真实穿搭效果图

## 技术栈

### 前端
- Vue 3 + Vite + TypeScript
- Naive UI（组件库）
- Pinia（状态管理）
- Vue Router
- Fetch API
- SCSS

### 后端
- NestJS + TypeScript
- 本地 JSON 数据存储
- 阿里云百炼 API（图像生成）

## 项目结构

```
outfit-ai-studio/
├── frontend/          # Vue 3 前端项目
│   ├── src/
│   │   ├── views/OutfitPreview/    # 主页面
│   │   │   ├── components/        # 子组件
│   │   │   │   ├── ItemLibrary.vue   # 单品库
│   │   │   │   ├── ItemCard.vue      # 单品卡片
│   │   │   │   ├── OutfitCanvas.vue  # 搭配区
│   │   │   │   ├── OutfitSlot.vue    # 搭配槽位
│   │   │   │   ├── ResultPreview.vue # 成果展示
│   │   │   │   └── TopActions.vue    # 顶部操作
│   │   │   └── index.vue
│   │   ├── stores/outfit.ts       # Pinia 状态管理
│   │   ├── api/                   # API 接口
│   │   └── types/outfit.ts        # TypeScript 类型
│   └── package.json
├── backend/           # NestJS 后端项目
│   ├── src/
│   │   ├── items/       # 单品模块
│   │   ├── outfits/     # 搭配模块
│   │   ├── generation/  # AI 生成模块
│   │   └── common/      # 公共工具
│   ├── data/            # 本地 JSON 数据
│   └── public/          # 静态资源
└── README.md
```

## 快速开始

### 环境要求
- Node.js 18+
- npm 9+

### 1. 安装依赖

```bash
# 前端
cd frontend
npm install

# 后端
cd backend
npm install
```

### 2. 配置环境变量

后端 `.env` 文件：

```env
# 阿里云百炼 API（可选，不配置则使用兜底图）
BAILIAN_API_KEY=sk-your-api-key-here
BAILIAN_WORKSPACE_ID=your-workspace-id
BAILIAN_MODEL=wan2.7-image

# Mock 模式开关
AI_IMAGE_USE_MOCK=true
```

### 3. 启动服务

```bash
# 启动后端（端口 3000）
cd backend
npm run start:dev

# 启动前端（端口 5173）
cd frontend
npm run dev
```

### 4. 访问应用

打开浏览器访问 http://localhost:5173

## 使用流程

1. **选择单品**：从左侧单品库点击"加入搭配"或拖拽到中间搭配区
2. **搭配组合**：在不同槽位添加外套、上衣、下装、鞋、包、配饰
3. **生成效果图**：点击"生成效果图"按钮，等待 AI 生成
4. **查看成果**：在右侧成果展示区查看生成的穿搭效果图

## API 接口

### 获取单品列表
```
GET /api/items
Query: keyword, category, season, occasion
```

### 保存搭配
```
POST /api/outfits
Body: { name: string, items: OutfitSelection }
```

### 生成穿搭图
```
POST /api/generation/outfit
Body: { items: OutfitSelection, prompt?: string }
```

## 数据

- **单品数据**：`backend/data/items.json`（25 个预置单品）
- **搭配记录**：`backend/data/outfits.json`
- **生成记录**：`backend/data/generation-tasks.json`

## 注意事项

1. **AI 图像生成**：需要配置阿里云百炼 API Key，否则使用兜底图
2. **图片资源**：Demo 使用占位图，实际使用时可替换为真实图片
3. **浏览器支持**：推荐 Chrome、Edge、Firefox 最新版本

## 开发计划

- [x] Phase 0: 项目脚手架
- [x] Phase 1: 类型定义 + Mock 数据
- [x] Phase 2: 静态页面 + 后端接口
- [x] Phase 3: 交互联调（拖拽 + 搜索）
- [x] Phase 4: AI 生成闭环
- [x] Phase 5: 打磨与兜底

## License

MIT
