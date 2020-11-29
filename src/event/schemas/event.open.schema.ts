import { prop } from '@typegoose/typegoose';

export class EventOpen {
  @prop()
  emailOrPhone: string;
}
