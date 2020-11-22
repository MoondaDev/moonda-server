import { IsEmail } from 'class-validator';

export class SendVerificationCodeDto {
  @IsEmail()
  readonly email: string;
}
