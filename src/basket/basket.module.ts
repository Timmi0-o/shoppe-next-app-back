import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../auth/schemas/User.Schema';
import { Product, ProductSchema } from '../product/schemas/Product.Schema';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { Basket, BasketSchema } from './schemas/Basket.Schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Basket.name, schema: BasketSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [BasketController],
  providers: [BasketService],
  exports: [BasketService],
})
export class BasketModule {}
