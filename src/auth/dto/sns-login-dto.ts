import { IsNotEmpty } from 'class-validator';

export class SnsLoginDto {
  @IsNotEmpty()
  readonly accessToken: string;
}
