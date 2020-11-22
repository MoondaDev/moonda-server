import { IsNotEmpty } from 'class-validator';

export class FindPasswordDto {
  @IsNotEmpty()
  readonly password: string;
}
