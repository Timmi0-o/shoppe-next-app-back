import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { BasketModule } from './basket/basket.module';

import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://Timmi:RieBcYaEwEbhgUQi@cluster0.aie9jx7.mongodb.net/shoppe',
      {
        tls: true,
      },
    ),
    ConfigModule.forRoot({ envFilePath: '.env' }),
    ProductModule,
    ReviewModule,
    BasketModule,
    AuthModule,
  ],
})
export class AppModule {}
