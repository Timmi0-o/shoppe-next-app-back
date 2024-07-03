import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Review } from 'src/review/schemas/Review.Schema';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: false, unique: false })
  displayName?: string;

  @Prop({ required: true, unique: false })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false })
  review?: Review;
}

export const UserSchema = SchemaFactory.createForClass(User);
