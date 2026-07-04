import { Module } from '@nestjs/common'
import { OutfitsController } from './outfits.controller'
import { OutfitsService } from './outfits.service'

@Module({
  controllers: [OutfitsController],
  providers: [OutfitsService],
})
export class OutfitsModule {}
