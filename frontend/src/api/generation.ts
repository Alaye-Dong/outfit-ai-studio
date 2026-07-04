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
