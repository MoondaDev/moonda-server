import { IsNotEmpty } from 'class-validator';

export class ChangeInfoDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly phone: string;
}
