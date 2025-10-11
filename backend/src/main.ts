import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  // Apply basic API hygiene (EN/KR guidance).
  // 기본 API 위생 설정(영문/국문 지침).
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = Number(process.env.APP_PORT ?? 3000);
  await app.listen(port);

  Logger.log(
    `Backend service running on port ${port}`,
    'Bootstrap / 백엔드 시작',
  );
}

bootstrap().catch((error) => {
  Logger.error(error, undefined, 'BootstrapError');
  process.exitCode = 1;
});
