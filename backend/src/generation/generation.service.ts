import { Injectable } from '@nestjs/common'
import { readFileSync, existsSync } from 'fs'
import { join, extname } from 'path'
import { BailianProvider } from './bailian.provider'
import { readJson, writeJson } from '../common/file-db'
import type { GenerationTask, ClothingItem } from '../common/types'

const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
}

@Injectable()
export class GenerationService {
  private readonly uploadsDir = join(__dirname, '..', '..', 'public', 'uploads')

  constructor(private readonly bailianProvider: BailianProvider) {}

  async generateOutfit(data: { items: Record<string, unknown>; prompt?: string }) {
    const clothingItems = this.extractClothingItems(data.items)
    const prompt = data.prompt || this.buildPrompt(clothingItems)
    
    // 提取参考图片并转换为 Base64
    const referenceImages = clothingItems
      .filter(item => item.imageUrl && !item.imageUrl.includes('placeholder'))
      .map(item => this.imageToBase64(item.imageUrl))
      .filter((img): img is string => img !== null)

    console.log(`[GenerationService] Found ${referenceImages.length} reference images`)

    try {
      const result = await this.bailianProvider.generate({ 
        prompt,
        referenceImages: referenceImages.length > 0 ? referenceImages : undefined
      })

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
        message: result.isFallback ? 'AI 接口调用失败，已展示预生成 Demo 效果图。请检查后端日志。' : '生成成功',
        data: {
          taskId: task.id,
          status: 'success',
          imageUrl: result.imageUrl,
          prompt,
          isFallback: result.isFallback,
        },
      }
    } catch (error: any) {
      console.error('[GenerationService] Error:', error)
      return {
        code: 500,
        message: `生成失败: ${error.message || '请稍后重试'}`,
        data: null,
      }
    }
  }

  private extractClothingItems(items: Record<string, unknown>): ClothingItem[] {
    const result: ClothingItem[] = []
    for (const value of Object.values(items)) {
      if (!value) continue
      if (Array.isArray(value)) {
        result.push(...(value as ClothingItem[]))
      } else {
        result.push(value as ClothingItem)
      }
    }
    return result
  }

  private imageToBase64(imagePath: string): string | null {
    try {
      // 处理相对路径
      let filePath = imagePath
      if (imagePath.startsWith('/uploads/')) {
        filePath = join(this.uploadsDir, imagePath.replace('/uploads/', ''))
      }
      
      if (!existsSync(filePath)) {
        console.warn('[GenerationService] Image file not found:', filePath)
        return null
      }

      const ext = extname(filePath).toLowerCase()
      const mimeType = MIME_MAP[ext]
      if (!mimeType) {
        console.warn('[GenerationService] Unsupported image format:', ext)
        return null
      }

      const buffer = readFileSync(filePath)
      const base64 = buffer.toString('base64')
      return `data:${mimeType};base64,${base64}`
    } catch (error) {
      console.error('[GenerationService] Failed to convert image to base64:', error)
      return null
    }
  }

  private buildPrompt(items: ClothingItem[]): string {
    if (items.length === 0) {
      return '请生成一张穿搭效果图'
    }

    const itemDescriptions = items.map(item => {
      const parts = [item.color, item.name]
      if (item.note) parts.push(item.note)
      return parts.join('')
    })

    return [
      '请生成一张真人模特全身穿搭图。',
      '模特正面站立，全身构图，背景为简洁摄影棚。',
      '真实电商服装展示风格，高清质感。',
      `模特穿着：${itemDescriptions.join('、')}。`,
      '整体风格自然、日常、适合服装搭配预览。'
    ].join('')
  }
}
