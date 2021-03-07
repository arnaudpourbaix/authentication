import { JwtPayload } from '@authentication/common-auth';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { VerifyCallback } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthModuleOptions } from '../../config/module.options';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService,
    @Inject(AuthModuleOptions)
    readonly config: AuthModuleOptions
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secretKey,
    });
  }

  async validate(payload: JwtPayload, done: VerifyCallback) {
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('invalid token claims');
    }
    done(null, payload);
  }
}
