import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
}

export const ProductSchema = SchemaFactory.createForClass(Product);
