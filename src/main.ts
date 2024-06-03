import './newrelic'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './helper/transform.interceptor';
import { validationExceptionFactory } from './shared/exceptions/validation.exception';
import newrelic from 'newrelic';
import { NewrelicInterceptor } from './newrelic.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new NewrelicInterceptor());
  app.enableCors();
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: validationExceptionFactory,
  }));
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableCors();
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Auth API form Frontend Learners')
    .setDescription('Free Backend API for Frontend Learners <br>If you like and learnt something new, consider <b><a href="https://www.buymeacoffee.com/nitishk72" target="_blank">Supporting</a></b> to keeping this api free forever.')
    .setVersion('v1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('', app, document);
  app.enableCors();
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, '0.0.0.0');
}
bootstrap();
