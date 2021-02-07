import { AuthProvider, GoogleProfile } from '@authentication/common-auth';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../../auth/auth.service';
import { AuthModuleOptions } from '../../config/module.options';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(AuthModuleOptions)
    readonly config: AuthModuleOptions,
    private readonly authService: AuthService
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
      const jwt: string = await this.authService.validateOAuthLogin(
        profile.id,
        AuthProvider.GOOGLE,
        { ...profile, accessToken, refreshToken }
      );
      return { jwt };
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
