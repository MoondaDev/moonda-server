import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiResponse } from '../util/http';
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
    await this.eventService.saveEventOpen(saveEventOpenDto.emailOrPhone);
    return ApiResponse.createSuccessApiResponse('Event 에 참가되었습니다.');
  }
}
