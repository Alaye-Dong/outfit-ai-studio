import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { ItemsModule } from './items/items.module'
import { OutfitsModule } from './outfits/outfits.module'
import { GenerationModule } from './generation/generation.module'
import { UploadModule } from './upload/upload.module'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    ItemsModule,
    OutfitsModule,
    GenerationModule,
    UploadModule,
  ],
})
export class AppModule {}
