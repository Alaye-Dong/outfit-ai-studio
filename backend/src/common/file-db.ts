import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const DATA_DIR = join(__dirname, '..', '..', 'data')

export function readJson<T>(filename: string): T {
  const filepath = join(DATA_DIR, filename)
  if (!existsSync(filepath)) {
    return [] as unknown as T
  }
  return JSON.parse(readFileSync(filepath, 'utf-8'))
}

export function writeJson<T>(filename: string, data: T): void {
  const filepath = join(DATA_DIR, filename)
  writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8')
}
