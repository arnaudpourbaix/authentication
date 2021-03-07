import {
  UpdatePasswordDto,
  UpdateUserDto,
  User,
} from '@authentication/common-auth';
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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { Response } from 'express';
import { AuthModuleOptions } from '../config/module.options';
import { GoogleExceptionFilter } from '../passport/google/google-exception.filter';
import { GoogleAuthGuard } from '../passport/google/guard';
import { JwtAuthGuard } from '../passport/jwt/guard';
import { LocalAuthGuard } from '../passport/local/guard';
import { RequestWithUser } from '../request/request-user';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthModuleOptions)
    private readonly config: AuthModuleOptions,
    private readonly userService: UserService
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: RequestWithUser) {
    console.log(req.user);
    return { token: req.user };
  }

  @Post('password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )
  async updatePassword(
    @Req() req: RequestWithUser,
    @Body() user: UpdatePasswordDto
  ) {
    const updateUser = await this.userService.updatePassword(
      req.user.sub,
      user
    );
    return classToPlain(updateUser) as User;
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )
  async updateUserProfile(
    @Req() req: RequestWithUser,
    @Body() user: UpdateUserDto
  ) {
    const updateUser = await this.userService.updateProfile(req.user.sub, user);
    return classToPlain(updateUser) as User;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getUserProfile(@Req() req: RequestWithUser) {
    const user = await this.userService.findById(req.user.sub);
    return classToPlain(user) as User;
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
