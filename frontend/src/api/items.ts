import { get, post, put } from './request'
import type { ClothingItem } from '@/types/outfit'

export function getItems(params?: {
  keyword?: string
  category?: string
  season?: string
  occasion?: string
}) {
  return get<ClothingItem[]>('/api/items', params)
}

export function createItem(itemData: Omit<ClothingItem, 'id'>) {
  return post<ClothingItem>('/api/items', itemData)
}

export function updateItem(id: string, itemData: Partial<Omit<ClothingItem, 'id'>>) {
  return put<ClothingItem>(`/api/items/${id}`, itemData)
}
