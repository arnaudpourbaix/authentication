import { User } from '@authentication/common-auth';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import authConfig from '../../config/auth.config';
import { AuthModuleOptions } from '../../config/module.options';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(authConfig.KEY)
    private readonly config: AuthModuleOptions,
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
    profile: {
      id: string;
      displayName: string;
      emails?: { value: string; verified: boolean }[];
      name?: { familyName: string; givenName: string };
      photos?: { value: string }[];
    }
    // done: Function
  ) {
    try {
      //   const jwtData: JwtData = {
      //     thirdPartyId: profile.id,
      //     accessToken,
      //     refreshToken,
      //   };
      const user: User = {
        id: profile.id,
        // googleId: profile.id,
        username: '',
        email: profile.emails?.[0].value as string,
        displayName: profile.displayName,
        photoUrl: profile.photos?.[0]?.value,
      };
      console.log('GoogleStrategy', 'validate');
      //   const jwt = await this.authService.validateOAuthLogin(jwtData, user);
      //   done(null, { user });
      return { user };
    } catch (err) {
      //   done(err, false);
      console.log('validate error', err);
      throw new UnauthorizedException(err);
    }
  }
}
