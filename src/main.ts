import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // Cors
  const app = await NestFactory.create(AppModule, { cors: true });

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // Swagger
  const options = new DocumentBuilder()
    .setTitle('Link Api Teste')
    .setDescription('Descrição das APIs utilizadas no teste da Link Api')
    .setVersion('1.0')
    .addTag('Link Api')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
