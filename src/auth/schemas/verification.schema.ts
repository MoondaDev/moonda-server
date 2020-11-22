import { HttpException, HttpStatus } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CustomException } from 'src/util/http';

export enum VerificationType {
  SIGNUP = 'SIGNUP',
  FIND_PASSWORD = 'FIND_PASSWORD',
}

@Schema({
  timestamps: true,
})
export class Verification extends Document {
  @Prop()
  email: string;

  @Prop()
  verificationCode: number;

  @Prop()
  verificationType: VerificationType;

  createdAt: Date;
  updatedAt: Date;

  validateCodeSent() {
    if (!this) {
      throw new HttpException(
        new CustomException('인증번호 전송 후 이용해주세요.'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);
