import {
  AuthConfig,
  JwtConfig,
  JwtPayload,
  User,
} from '@authentication/common-auth';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { classToPlain } from 'class-transformer';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService,
    configService: ConfigService<AuthConfig>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<JwtConfig>('jwt')?.secretKey,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findOne(payload.username);
    if (!user) {
      throw new UnauthorizedException('invalid token claims');
    }
    return classToPlain(user) as User;
  }
}
