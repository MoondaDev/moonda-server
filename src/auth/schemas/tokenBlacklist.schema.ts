import { prop } from '@typegoose/typegoose';

export class Tokenblacklist {
  @prop({ required: true })
  token: string;
}
