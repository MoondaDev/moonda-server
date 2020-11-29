import { IsNotEmpty } from 'class-validator';

export class SaveEventOpenDto {
  @IsNotEmpty()
  readonly emailOrPhone: string;

  readonly expectaionMessage: string;
}
