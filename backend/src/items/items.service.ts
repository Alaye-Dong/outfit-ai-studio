import { Injectable } from '@nestjs/common'
import { readJson, writeJson } from '../common/file-db'
import type { ClothingItem } from '../common/types'

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

  create(itemData: Omit<ClothingItem, 'id'>): { code: number; message: string; data: ClothingItem } {
    const items = readJson<ClothingItem[]>('items.json')
    
    // 生成新ID：找到现有ID的最大值，然后+1
    let maxId = 0
    items.forEach(item => {
      const match = item.id.match(/^item_(\d+)$/)
      if (match) {
        const num = parseInt(match[1], 10)
        if (num > maxId) maxId = num
      }
    })
    
    const newItem: ClothingItem = {
      id: `item_${String(maxId + 1).padStart(3, '0')}`,
      ...itemData
    }
    
    items.push(newItem)
    writeJson('items.json', items)
    
    return { code: 0, message: 'ok', data: newItem }
  }
}
