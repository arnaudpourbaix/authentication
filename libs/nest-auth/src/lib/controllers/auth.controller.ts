import {
  AuthConfig,
  CreateUserDto,
  GoogleConfig,
  User,
} from '@authentication/common-auth';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { GoogleAuthGuard } from '../passport/google/guard';
import { JwtAuthGuard } from '../passport/jwt/guard';
import { LocalAuthGuard } from '../passport/local/guard';
import { RequestWithUser } from '../request/request-user';
import { AuthService } from '../services/auth.service';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService<AuthConfig>,
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() user: CreateUserDto) {
    return this.userService.create(user);
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
  googleLoginCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    const config = this.configService.get<GoogleConfig>('google');
    const url = req.user ? config?.successLoginUrl : config?.failureLoginUrl;
    console.log('googleLoginCallback', url, req.user);
    res.redirect(`${url}`);
  }
}
