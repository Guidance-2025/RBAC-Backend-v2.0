import * as dotenv from 'dotenv';
// Load dotenv before other imports
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  
  console.log('MongoDB URI:', process.env.MONGO_URI); // Add this to debug
  
  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();