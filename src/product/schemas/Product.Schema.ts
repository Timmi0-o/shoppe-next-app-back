import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductSetting } from './ProductSetting.Schema';

@Schema()
export class Product {
  @Prop()
  title: string;

  @Prop()
  price: number;

  @Prop()
  description: string;

  @Prop({ required: false })
  fullDescription: string;

  @Prop()
  img: string;

  @Prop()
  additionalImg?: string[];

  @Prop({ type: ProductSetting })
  setting?: ProductSetting;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
