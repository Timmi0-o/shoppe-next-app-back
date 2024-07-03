import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://Timmi:RieBcYaEwEbhgUQi@cluster0.aie9jx7.mongodb.net/shoppe',
      {
        tls: true,
        tlsInsecure: true, // Только для отладки, не используйте в продакшене
      },
    ),
    ConfigModule.forRoot({ envFilePath: '.env' }),
    ProductModule,
    ReviewModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
