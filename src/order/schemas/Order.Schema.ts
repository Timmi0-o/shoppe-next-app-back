import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/auth/schemas/User.Schema';
import { OrderData, OrderDataSchema } from './OrderData.Schema';

@Schema()
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: [OrderDataSchema], default: [] })
  orders: OrderData[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
