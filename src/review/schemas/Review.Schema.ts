import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/auth/schemas/User.Schema';
import { Product } from 'src/product/schemas/Product.schema';

@Schema()
export class Review {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  product: Product;

  @Prop({ required: true, unique: false })
  feedback: string;

  @Prop({ default: Date.now })
  date: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
