import { CreateUserDto, User } from '@authentication/common-auth';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthModuleOptions } from '../config/module.options';
import { GoogleExceptionFilter } from '../passport/google/google-exception.filter';
import { GoogleAuthGuard } from '../passport/google/guard';
import { JwtAuthGuard } from '../passport/jwt/guard';
import { LocalAuthGuard } from '../passport/local/guard';
import { RequestWithUser } from '../request/request-user';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthModuleOptions)
    private readonly config: AuthModuleOptions,
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: RequestWithUser) {
    console.log('login', req.user);
    // return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() user: CreateUserDto) {
    return this.userService.create(user);
    //.then((result) => {
    //   return this.authService.login(result as any);
    //});
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithUser): User {
    return req.user;
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @UseFilters(GoogleExceptionFilter)
  googleLoginCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    res.redirect(`${this.config.google.successLoginUrl}?token=${req.user}`);
  }
}
