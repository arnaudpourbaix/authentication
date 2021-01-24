import { JwtPayload, User } from '@authentication/common-auth';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { classToPlain } from 'class-transformer';
import { ExtractJwt, Strategy } from 'passport-jwt';
import authConfig from '../../config/auth.config';
import { AuthModuleOptions } from '../../config/module.options';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService,
    @Inject(authConfig.KEY)
    private readonly config: AuthModuleOptions
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secretKey,
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
