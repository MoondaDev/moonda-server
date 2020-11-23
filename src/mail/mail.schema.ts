import { prop } from '@typegoose/typegoose';

export class Mail {
  @prop({ required: true })
  subject: string;

  @prop({ required: true })
  template: string;

  @prop({ required: true })
  context: any;

  @prop()
  toName: string;

  @prop({ required: true })
  toEmail: string;

  @prop({ required: true })
  fromName: string;

  @prop({ required: true })
  fromEmail: string;
}
