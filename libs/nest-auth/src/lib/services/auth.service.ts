import { JwtData, JwtPayload, User } from '@authentication/common-auth';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { classToPlain } from 'class-transformer';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth.config';
import { AuthModuleOptions } from '../config/module.options';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY)
    private readonly config: AuthModuleOptions,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateLogin(username: string, pass: string): Promise<User | null> {
    const user = await this.userService.findOne(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return classToPlain(user) as User;
    }
    return null;
  }

  async login(user: User): Promise<User> {
    const payload: JwtPayload = { username: user.username, sub: user.id };
    user.accessToken = await this.jwtService.signAsync(payload);
    return user;
  }

  async validateOAuthLogin(jwtData: JwtData): Promise<string> {
    try {
      //   await this.userService.create(user);
      const jwt: string = sign(jwtData, this.config.jwt.secretKey, {
        expiresIn: this.config.jwt.expires,
      });
      return jwt;
    } catch (err) {
      throw new InternalServerErrorException('validateOAuthLogin', err.message);
    }
  }
}
