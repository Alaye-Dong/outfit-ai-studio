import { Injectable } from '@nestjs/common'
import { BailianProvider } from './bailian.provider'
import { readJson, writeJson } from '../common/file-db'
import type { GenerationTask } from '../common/types'

@Injectable()
export class GenerationService {
  constructor(private readonly bailianProvider: BailianProvider) {}

  async generateOutfit(data: { items: Record<string, unknown>; prompt?: string }) {
    const prompt = data.prompt || '请生成一张穿搭效果图'

    try {
      const result = await this.bailianProvider.generate({ prompt })

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
        message: result.isFallback ? 'AI 接口暂不可用，已展示预生成 Demo 效果图' : '生成成功',
        data: {
          taskId: task.id,
          status: 'success',
          imageUrl: result.imageUrl,
          prompt,
          isFallback: result.isFallback,
        },
      }
    } catch (error) {
      return {
        code: 500,
        message: '生成失败，请稍后重试',
        data: null,
      }
    }
  }
}
