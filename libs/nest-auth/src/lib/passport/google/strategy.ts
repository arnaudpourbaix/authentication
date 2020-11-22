import { AuthConfig, GoogleConfig, User } from '@authentication/common-auth';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    readonly configService: ConfigService<AuthConfig>,
    private readonly authService: AuthService
  ) {
    super({
      clientID: configService.get<GoogleConfig>('google')?.clientId,
      clientSecret: configService.get<GoogleConfig>('google')?.clientSecret,
      callbackURL: configService.get<GoogleConfig>('google')?.redirectUrl,
      passReqToCallback: false,
      scope: configService.get<GoogleConfig>('google')?.scopes,
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
