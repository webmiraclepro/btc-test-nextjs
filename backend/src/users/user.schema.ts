import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true, index: true })
  address: string;

  @Prop({ required: true, default: 0 })
  score: number;

  plusScore: () => number;

  minusScore: () => number;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.plusScore = function (): number {
  return ++this.score;
};

UserSchema.methods.minusScore = function (): number {
  return --this.score;
};
