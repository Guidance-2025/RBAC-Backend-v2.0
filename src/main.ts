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
bootstrap();import * as dotenv from 'dotenv';
// Load dotenv before other imports
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  
  console.log('MongoDB URI:', process.env.MONGO_URI); // Add this to debug

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('RBAC API')
    .setDescription('API documentation for Role-Based Access Control System')
    .setVersion('2.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log('Swagger API Docs available at http://localhost:3000/api/docs');
}
bootstrap();