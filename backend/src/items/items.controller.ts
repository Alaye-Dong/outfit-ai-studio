import { Controller, Get, Query } from '@nestjs/common'
import { ItemsService } from './items.service'

@Controller('api/items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll(@Query() query: { keyword?: string; category?: string; season?: string; occasion?: string }) {
    return this.itemsService.findAll(query)
  }
}
