import { HttpException, HttpStatus } from '@nestjs/common';
import { prop } from '@typegoose/typegoose';
import { CustomException } from 'src/util/http';

export enum VerificationType {
  SIGNUP = 'SIGNUP',
  FIND_PASSWORD = 'FIND_PASSWORD',
}

export class Verification {
  @prop({ required: true })
  email: string;

  @prop({ required: true })
  verificationCode: number;

  @prop({ required: true })
  verificationType: VerificationType;

  createdAt: Date;
  updatedAt: Date;

  validateSameCode(verificationCode: number) {
    if (this.verificationCode != verificationCode) {
      throw new HttpException(
        new CustomException('인증번호가 틀렸습니다.'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  validateExpireTime() {
    const createdDate = new Date(this.createdAt);
    const expiredDate = createdDate.setDate(createdDate.getDay() + 1);
    const nowDate = new Date();
    if (expiredDate < nowDate.getDate()) {
      throw new HttpException(
        new CustomException('인증시간을 초과했습니다.'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
