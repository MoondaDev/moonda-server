import { prop } from '@typegoose/typegoose';

export class EventOpen {
  @prop()
  email: string;

  @prop()
  phone: string;
}
