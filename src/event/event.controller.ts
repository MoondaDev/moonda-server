import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiResponse, CustomException } from '../util/http';
import { EventService } from './event.service';
import { SaveEventOpenDto } from './dto/save-event.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @HttpCode(200)
  @Post('open')
  async check(
    @Body() saveEventOpenDto: SaveEventOpenDto,
  ): Promise<ApiResponse> {
    if (!saveEventOpenDto.email && !saveEventOpenDto.phone) {
      throw new HttpException(
        new CustomException('이메일 혹은 전화번호를 기입해주세요.'),
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.eventService.saveEventOpen(
      saveEventOpenDto.email,
      saveEventOpenDto.phone,
    );
    return ApiResponse.createSuccessApiResponse('Event 에 참가되었습니다.');
  }
}
