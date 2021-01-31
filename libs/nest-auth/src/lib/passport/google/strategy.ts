import { AuthProvider, GoogleProfile } from '@authentication/common-auth';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthModuleOptions } from '../../config/module.options';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(AuthModuleOptions)
    readonly config: AuthModuleOptions,
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {
    super({
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.redirectUrl,
      passReqToCallback: false,
      scope: config.google.scopes,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile
  ) {
    try {
      console.log('GoogleStrategy', 'validate');
      const jwt: string = await this.authService.validateOAuthLogin(
        profile.id,
        AuthProvider.GOOGLE,
        { ...profile, accessToken, refreshToken }
      );
      return { jwt };
    } catch (err) {
      console.log('GoogleStrategy', 'validate error', err);
      throw new UnauthorizedException(err);
    }
  }
}
