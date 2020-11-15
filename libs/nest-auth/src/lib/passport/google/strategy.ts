import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import {
  AuthConfig,
  GoogleConfig,
  JwtData,
  User,
} from '@authentification/common-auth';
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
      name?: { familyName: string; givenName: string };
      photos?: { value: string }[];
    },
    done: Function
  ) {
    try {
      const jwtData: JwtData = {
        thirdPartyId: profile.id,
        accessToken,
        refreshToken,
      };
      const user: User = {
        id: profile.id,
        // googleId: profile.id,
        username: '',
        displayName: profile.displayName,
        photoUrl: profile.photos?.[0]?.value,
      };
      const jwt = await this.authService.validateOAuthLogin(jwtData, user);
      done(null, { jwt });
    } catch (err) {
      done(err, false);
    }
  }
}
