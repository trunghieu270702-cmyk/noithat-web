import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT ?? 3001;
  console.log(`[DEBUG] Attempting to listen on port ${port}...`);
  await app.listen(port, '0.0.0.0');
  console.log(`[DEBUG] Successfully bound to port ${port}`);
}
bootstrap();
