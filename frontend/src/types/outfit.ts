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
  maxCount: number
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
