import { IsNotEmpty } from 'class-validator';

export class VerifyPasswordDto {
  @IsNotEmpty()
  readonly password: string;
}
