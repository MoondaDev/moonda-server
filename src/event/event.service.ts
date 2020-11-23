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

  async saveEventOpen(email: string, phone: string): Promise<EventOpen> {
    if (email) {
      const eventOpen = await this.findEventOpenByEmail(email);
      if (eventOpen) {
        throw new HttpException(
          new CustomException('이미 이벤트 등록된 이메일입니다.'),
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (phone) {
      const eventOpen = await this.findEventOpenByPhone(phone);
      if (eventOpen) {
        throw new HttpException(
          new CustomException('이미 이벤트 등록된 전화번호입니다.'),
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const eventOpen = new this.eventOpenModel();
    eventOpen.email = email;
    eventOpen.phone = phone;
    return await eventOpen.save();
  }

  async findEventOpenByEmail(email: string): Promise<EventOpen> {
    const eventOpen = await this.eventOpenModel.findOne({ email }).exec();
    return eventOpen;
  }

  async findEventOpenByPhone(phone: string): Promise<EventOpen> {
    const eventOpen = await this.eventOpenModel.findOne({ phone }).exec();
    return eventOpen;
  }
}
