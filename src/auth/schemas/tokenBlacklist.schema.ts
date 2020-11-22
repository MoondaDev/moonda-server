import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Tokenblacklist extends Document {
  @Prop()
  token: string;
}

export const TokenblacklistSchema = SchemaFactory.createForClass(
  Tokenblacklist,
);
