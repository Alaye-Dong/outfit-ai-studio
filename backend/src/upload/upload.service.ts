import { Injectable } from '@nestjs/common'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

@Injectable()
export class UploadService {
  private readonly uploadDir = join(__dirname, '..', '..', 'public', 'uploads')

  constructor() {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true })
    }
  }

  getUploadPath(): string {
    return this.uploadDir
  }

  getFileUrl(filename: string): string {
    return `/uploads/${filename}`
  }
}
