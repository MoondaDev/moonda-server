import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailSignupDto {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly name: string;

  readonly phone: string;

  @IsNotEmpty()
  readonly verificationCode: number;
}
