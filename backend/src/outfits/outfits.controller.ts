import { Controller, Post, Body } from '@nestjs/common'
import { OutfitsService } from './outfits.service'

@Controller('api/outfits')
export class OutfitsController {
  constructor(private readonly outfitsService: OutfitsService) {}

  @Post()
  create(@Body() body: { name: string; items: Record<string, unknown> }) {
    return this.outfitsService.create(body)
  }
}
