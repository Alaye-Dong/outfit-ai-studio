import { Injectable } from '@nestjs/common'
import 'dotenv/config'

interface GenerateImageInput {
  prompt: string
  referenceImages?: string[]
}

interface GenerateImageOutput {
  imageUrl: string
  isFallback: boolean
  raw?: unknown
}

@Injectable()
export class BailianProvider {
  private readonly apiKey = process.env.BAILIAN_API_KEY || ''
  private readonly workspaceId = process.env.BAILIAN_WORKSPACE_ID || ''
  private readonly model = process.env.BAILIAN_MODEL || 'wan2.7-image'
  private readonly useMock = process.env.AI_IMAGE_USE_MOCK === 'true'

  private get baseUrl(): string {
    // 如果有 workspaceId，使用工作空间格式；否则使用通用格式
    if (this.workspaceId) {
      return `https://${this.workspaceId}.cn-beijing.maas.aliyuncs.com/api/v1`
    }
    return 'https://dashscope.aliyuncs.com/api/v1'
  }

  async generate(input: GenerateImageInput): Promise<GenerateImageOutput> {
    if (this.useMock || !this.apiKey) {
      console.log('[BailianProvider] Using mock/fallback mode', { useMock: this.useMock, hasApiKey: !!this.apiKey })
      return this.getFallbackImage()
    }

    try {
      return await this.generateSync(input)
    } catch (syncError) {
      console.warn('[BailianProvider] Sync call failed, trying async:', syncError)
      try {
        return await this.generateAsync(input)
      } catch (asyncError) {
        console.error('[BailianProvider] Both sync and async failed:', asyncError)
        return this.getFallbackImage()
      }
    }
  }

  private async generateSync(input: GenerateImageInput): Promise<GenerateImageOutput> {
    const url = `${this.baseUrl}/services/aigc/multimodal-generation/generation`
    console.log('[BailianProvider] Calling sync API:', url)

    const body: Record<string, unknown> = {
      model: this.model,
      input: {
        messages: [
          {
            role: 'user',
            content: [{ text: input.prompt }],
          },
        ],
      },
      parameters: {
        size: '1024*1024',
        n: 1,
        watermark: false,
      },
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Sync API error ${response.status}: ${errorText}`)
    }

    const result = await response.json()
    console.log('[BailianProvider] Sync response:', JSON.stringify(result).substring(0, 500))
    
    const imageUrl = result.output?.choices?.[0]?.message?.content?.[0]?.image

    if (!imageUrl) {
      throw new Error('No image URL in sync response')
    }

    return { imageUrl, isFallback: false, raw: result }
  }

  private async generateAsync(input: GenerateImageInput): Promise<GenerateImageOutput> {
    const submitUrl = `${this.baseUrl}/services/aigc/image-generation/generation`
    console.log('[BailianProvider] Calling async API:', submitUrl)

    const body = {
      model: this.model,
      input: {
        messages: [{ role: 'user', content: [{ text: input.prompt }] }],
      },
      parameters: { size: '1024*1024', n: 1, watermark: false },
    }

    const submitRes = await fetch(submitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'X-DashScope-Async': 'enable',
      },
      body: JSON.stringify(body),
    })

    if (!submitRes.ok) {
      const errorText = await submitRes.text()
      throw new Error(`Async submit error ${submitRes.status}: ${errorText}`)
    }

    const submitData = await submitRes.json()
    const taskId = submitData.output?.task_id

    if (!taskId) {
      throw new Error('No task_id in async submit response')
    }

    console.log('[BailianProvider] Async task created:', taskId)

    const pollUrl = `${this.baseUrl}/tasks/${taskId}`
    for (let i = 0; i < 60; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000))

      const pollRes = await fetch(pollUrl, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
      })

      if (!pollRes.ok) continue

      const pollData = await pollRes.json()
      const status = pollData.output?.task_status
      console.log(`[BailianProvider] Poll ${i + 1}: status=${status}`)

      if (status === 'SUCCEEDED') {
        const imageUrl =
          pollData.output?.results?.[0]?.url ||
          pollData.output?.choices?.[0]?.message?.content?.[0]?.image

        if (imageUrl) {
          return { imageUrl, isFallback: false, raw: pollData }
        }
        break
      }

      if (status === 'FAILED') {
        throw new Error(`Async task failed: ${pollData.code} ${pollData.message}`)
      }
    }

    throw new Error('Async polling timeout')
  }

  private getFallbackImage(): GenerateImageOutput {
    const fallbackImages = [
      '/generated/fallback-001.png',
      '/generated/fallback-002.png',
      '/generated/fallback-003.png',
    ]
    return {
      imageUrl: fallbackImages[Math.floor(Math.random() * fallbackImages.length)],
      isFallback: true,
    }
  }
}
