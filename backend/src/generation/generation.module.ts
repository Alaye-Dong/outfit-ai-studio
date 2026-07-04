import { Module } from '@nestjs/common'
import { GenerationController } from './generation.controller'
import { GenerationService } from './generation.service'
import { BailianProvider } from './bailian.provider'

@Module({
  controllers: [GenerationController],
  providers: [GenerationService, BailianProvider],
})
export class GenerationModule {}
