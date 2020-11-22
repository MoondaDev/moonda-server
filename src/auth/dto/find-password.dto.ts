import { IsEmail, IsNotEmpty } from 'class-validator';

export class FindPasswordDto {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly verificationCode: number;
}
