import { HttpException, HttpStatus } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CustomException } from 'src/util/http';

export enum AuthType {
  'email' = 'email',
  'google' = 'google',
  'facebook' = 'facebook',
}

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop()
  authType: AuthType;

  @Prop()
  isExit: boolean;

  @Prop()
  exitReason: string;

  validateUserSignup() {
    if (!this) {
      throw new HttpException(
        new CustomException('등록되지 않은 이메일입니다.'),
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  validateUserAlreadySignup() {
    if (this) {
      throw new HttpException(
        new CustomException('이미 가입된 이메일입니다.'),
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  validateAuthType(authType: AuthType) {
    if (this.authType !== authType) {
      throw new HttpException(
        new CustomException(
          '이 이메일은 다른 로그인 방식으로 가입되어 있습니다.',
        ),
        HttpStatus.FORBIDDEN,
      );
    }
  }

  validateUserExit(): void {
    if (this.isExit) {
      throw new HttpException(
        new CustomException('탈퇴된 계정입니다. 다른 계정을 이용해주세요.'),
        HttpStatus.FORBIDDEN,
      );
    }
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
