import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ProductList {
  @Prop()
  title: string;

  @Prop()
  totalPrice: number;
}

export const ProductListSchema = SchemaFactory.createForClass(ProductList);
