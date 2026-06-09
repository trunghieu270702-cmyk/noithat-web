import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'https://frontend-production-280f.up.railway.app'
    ].filter(Boolean) as string[],
    credentials: true,
  });
  const port = process.env.PORT ?? 3001;
  console.log(`[DEBUG] Attempting to listen on port ${port}...`);
  await app.listen(port, '0.0.0.0');
  console.log(`[DEBUG] Successfully bound to port ${port}`);
}
bootstrap();
