import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ProductSetting {
  @Prop({ default: false })
  isLike: boolean;
}

export const ProductSettingSchema =
  SchemaFactory.createForClass(ProductSetting);
