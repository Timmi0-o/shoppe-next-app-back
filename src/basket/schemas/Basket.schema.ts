import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/auth/schemas/User.Schema';
import { ProductItem, ProductItemSchema } from './ProductItem.Schema';

@Schema()
export class Basket {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: [ProductItemSchema], default: [], required: false })
  products: ProductItem[];
}

export const BasketSchema = SchemaFactory.createForClass(Basket);
