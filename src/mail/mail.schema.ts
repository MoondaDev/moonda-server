import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Mail extends Document {
  @Prop()
  subject: string;

  @Prop()
  template: string;

  @Prop()
  context: any;

  @Prop()
  toName: string;

  @Prop()
  toEmail: string;

  @Prop()
  fromName: string;

  @Prop()
  fromEmail: string;
}

export const MailSchema = SchemaFactory.createForClass(Mail);
