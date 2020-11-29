import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  // ELB Default health check url
  @Get('')
  async healthCheckForRoot(): Promise<string> {
    return 'Server is healthy! - Moonda Server';
  }
  @Get('health')
  async healthCheck(): Promise<string> {
    return 'Server is healthy! - Moonda Server';
  }
}
