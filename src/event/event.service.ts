import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { CustomException } from 'src/util/http';
import { EventOpen } from './schemas/event.open.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(EventOpen)
    private readonly eventOpenModel: ReturnModelType<typeof EventOpen>,
  ) {}

  async saveEventOpen(emailOrPhone: string): Promise<EventOpen> {
    const findEventOpen = await this.findEventOpenByEmailOrPhone(emailOrPhone);
    if (findEventOpen) {
      throw new HttpException(
        new CustomException('이미 이벤트에 등록된 연락수단입니다.'),
        HttpStatus.BAD_REQUEST,
      );
    }

    const eventOpen = new this.eventOpenModel();
    eventOpen.emailOrPhone = emailOrPhone;
    return await eventOpen.save();
  }

  async findEventOpenByEmailOrPhone(emailOrPhone: string): Promise<EventOpen> {
    const eventOpen = await this.eventOpenModel
      .findOne({ emailOrPhone })
      .exec();
    return eventOpen;
  }
}
