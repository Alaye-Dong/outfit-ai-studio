import { Controller, Post, Body } from '@nestjs/common'
import { GenerationService } from './generation.service'

@Controller('api/generation')
export class GenerationController {
  constructor(private readonly generationService: GenerationService) {}

  @Post('outfit')
  async generateOutfit(@Body() body: { items: Record<string, unknown>; prompt?: string }) {
    return this.generationService.generateOutfit(body)
  }
}
