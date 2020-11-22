import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  async healthCheck(): Promise<string> {
    return 'Server is healthy! - XX Server';
  }
}
