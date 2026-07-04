import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus } from '@nestjs/common'
import { ItemsService } from './items.service'
import type { ClothingItem } from '../common/types'

@Controller('api/items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll(@Query() query: { keyword?: string; category?: string; season?: string; occasion?: string }) {
    return this.itemsService.findAll(query)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() itemData: Omit<ClothingItem, 'id'>) {
    return this.itemsService.create(itemData)
  }
}
