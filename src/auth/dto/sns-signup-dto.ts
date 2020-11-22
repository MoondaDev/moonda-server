import { IsNotEmpty } from 'class-validator';

export class SnsSignupDto {
  @IsNotEmpty()
  readonly accessToken: string;
}
