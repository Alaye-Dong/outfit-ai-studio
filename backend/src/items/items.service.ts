import { Injectable } from '@nestjs/common'
import { readJson } from '../common/file-db'
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
}
