import {
  AuthConfig,
  JwtConfig,
  JwtData,
  JwtPayload,
  User,
} from '@authentification/common-auth';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { classToPlain } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<AuthConfig>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.userService.findOne(username);
    if (user && (await this.passwordsAreEqual(user.password, pass))) {
      return classToPlain(user) as User;
    }
    return null;
  }

  async login(user: User): Promise<User> {
    const payload: JwtPayload = { username: user.username, sub: user.id };
    user.accessToken = await this.jwtService.signAsync(payload);
    return user;
  }

  async validateOAuthLogin(jwtData: JwtData, user: User): Promise<string> {
    try {
      await this.userService.create(user);
      const jwt: string = sign(
        jwtData,
        this.configService.get<JwtConfig>('jwt')?.secretKey as string,
        { expiresIn: this.configService.get<JwtConfig>('jwt')?.expires }
      );
      return jwt;
    } catch (err) {
      throw new InternalServerErrorException('validateOAuthLogin', err.message);
    }
  }

  private async passwordsAreEqual(
    hashedPassword: string,
    plainPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
