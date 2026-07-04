export type ClothingCategory =
  | 'top'
  | 'bottom'
  | 'dress'
  | 'outerwear'
  | 'shoes'
  | 'bag'
  | 'accessory'

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

export interface OutfitSelection {
  outerwear?: ClothingItem
  top?: ClothingItem
  bottom?: ClothingItem
  dress?: ClothingItem
  shoes?: ClothingItem
  bag?: ClothingItem
  accessory?: ClothingItem[]
}

export interface OutfitRecord {
  id: string
  name: string
  items: OutfitSelection
  createdAt: string
}

export interface GenerationTask {
  id: string
  prompt: string
  imageUrl: string
  isFallback: boolean
  createdAt: string
}
