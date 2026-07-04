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
