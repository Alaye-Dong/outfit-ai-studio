import { post } from './request'
import type { OutfitSelection } from '@/types/outfit'

export function saveOutfit(data: { name: string; items: OutfitSelection }) {
  return post<{ id: string; name: string; createdAt: string }>('/api/outfits', data)
}
