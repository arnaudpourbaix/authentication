import { AuthConfig, LoginConfig, User } from '@authentication/common-auth';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { GoogleAuthGuard } from '../passport/google/guard';
import { JwtAuthGuard } from '../passport/jwt/guard';
import { LocalAuthGuard } from '../passport/local/guard';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService<AuthConfig>,
    private readonly authService: AuthService
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() data: any) {
    console.log(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any): Promise<User> {
    return req.user;
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleLoginCallback(@Req() req: any, @Res() res: Response) {
    const user = req.user;
    console.log('googleLoginCallback', user);
    if (user) {
      const loginSuccessUrl = this.configService.get<LoginConfig>('login')
        ?.loginSuccessUrl;
      res.redirect(`${loginSuccessUrl}/#/?jwt=${req.user.jwt}`);
    } else {
      // res.redirect(`${loginSuccessUrl}/#/?jwt=${req.user.jwt}`);
    }
  }
}
