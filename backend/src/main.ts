import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import 'dotenv/config'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors()
  app.useStaticAssets(join(__dirname, '..', 'public'))
  await app.listen(3000)
  console.log('Server running on http://localhost:3000')
}
bootstrap()
