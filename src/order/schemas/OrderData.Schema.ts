import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductList, ProductListSchema } from './ProductList.Schema';

@Schema()
export class OrderData {
  @Prop({ unique: true })
  number: string;

  @Prop()
  email: string;

  @Prop()
  paymentMethod: string;

  @Prop({ default: Date.now })
  date: Date;

  @Prop()
  deliveryOptions: string;

  @Prop()
  deliveryAddress: string;

  @Prop()
  contactPhone: string;

  @Prop({ default: 'Free shipping' })
  shipping: string;

  @Prop({ type: [ProductListSchema], required: true })
  productList: ProductList[];
}

export const OrderDataSchema = SchemaFactory.createForClass(OrderData);
