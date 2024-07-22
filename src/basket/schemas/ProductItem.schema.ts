import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Product } from 'src/product/schemas/Product.schema';

@Schema()
export class ProductItem {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  productId: Product;

  @Prop({ required: false, default: 1 })
  qty: number;
}

export const ProductItemSchema = SchemaFactory.createForClass(ProductItem);
