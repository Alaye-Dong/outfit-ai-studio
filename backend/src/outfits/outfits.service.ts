import { Injectable } from '@nestjs/common'
import { readJson, writeJson } from '../common/file-db'
import type { OutfitRecord } from '../common/types'

@Injectable()
export class OutfitsService {
  create(data: { name: string; items: Record<string, unknown> }) {
    const outfits = readJson<OutfitRecord[]>('outfits.json')
    const newOutfit: OutfitRecord = {
      id: `outfit_${String(outfits.length + 1).padStart(3, '0')}`,
      name: data.name,
      items: data.items as any,
      createdAt: new Date().toISOString(),
    }
    outfits.push(newOutfit)
    writeJson('outfits.json', outfits)

    return { code: 0, message: '保存成功', data: newOutfit }
  }
}
