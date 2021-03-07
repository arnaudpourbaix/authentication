import {
  AuthProvider,
  GoogleOAuthData,
  TokenData,
} from '@authentication/common-auth';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { AuthModuleOptions } from '../config/module.options';
import { GoogleConflictException } from '../passport/google/google.exception';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AuthModuleOptions)
    private readonly config: AuthModuleOptions,
    private readonly userService: UserService
  ) {}

  async validateLogin(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    const error = 'Utilisateur ou mot de passe incorrect';
    if (!user) {
      throw new UnauthorizedException(error);
    }
    if (user && (await bcrypt.compare(password, user.password ?? ''))) {
      return this.jwtSignIn(user.id);
    } else {
      throw new UnauthorizedException(error);
    }
  }

  async validateOAuthLogin(
    providerId: string,
    provider: AuthProvider,
    data: GoogleOAuthData
  ) {
    let user = await this.userService.getUserByProviderId(providerId);
    if (user) {
      throw new GoogleConflictException('Utilisateur déjà enregistré');
    }
    const email =
      data.emails.find((e) => e.verified)?.value ||
      (data.emails[0]?.value as string);
    user = await this.userService.createFromProvider({
      provider,
      providerId,
      firstName: data.name?.givenName,
      lastName: data.name?.familyName,
      displayName: data.displayName,
      photoUrl: data.photos?.[0]?.value,
      email,
      providerAccessToken: data.accessToken,
    });
    return this.jwtSignIn(user.id);
  }

  jwtSignIn(userId: string) {
    const jwt = sign(
      {
        sub: userId,
      } as TokenData,
      this.config.jwt.secretKey,
      {
        expiresIn: this.config.jwt.expires,
      }
    );
    return jwt;
  }
}
