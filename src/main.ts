import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './Exceptions/AllExceptionsFilter';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(PORT, () => console.log(`СЕРВЕР РАБОТАЕТ НА ПОРТУ ${PORT}`));
}
bootstrap();
