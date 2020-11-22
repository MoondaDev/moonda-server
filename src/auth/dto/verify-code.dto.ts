import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyCodeDto {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly verificationCode: number;
}
