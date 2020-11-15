import { JwtAuthGuard } from '@authentication/nest-auth';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('test')
  @UseGuards(JwtAuthGuard)
  async test(@Req() req: any) {
    return 'test OK';
  }
}
