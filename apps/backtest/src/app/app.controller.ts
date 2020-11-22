import { JwtAuthGuard } from '@authentication/nest-auth';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('test')
  @UseGuards(JwtAuthGuard)
  async test() {
    return 'test OK';
  }
}
