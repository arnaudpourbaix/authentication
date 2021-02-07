import {
  AuthProvider,
  GoogleOAuthData,
  JwtPayload,
  User,
} from '@authentication/common-auth';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { classToPlain } from 'class-transformer';
import { sign } from 'jsonwebtoken';
import { AuthModuleOptions } from '../config/module.options';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AuthModuleOptions)
    private readonly config: AuthModuleOptions,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateLogin(username: string, pass: string): Promise<User | null> {
    const user = await this.userService.findOne(username);
    if (user && (await bcrypt.compare(pass, user.password ?? ''))) {
      return classToPlain(user) as User;
    }
    return null;
  }

  async login(user: User): Promise<User> {
    const payload: JwtPayload = { username: user.username, sub: user.id };
    user.accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.jwt.secretKey,
      expiresIn: this.config.jwt.expires,
    });
    return user;
  }

  async validateOAuthLogin(
    providerId: string,
    provider: AuthProvider,
    data: GoogleOAuthData
  ): Promise<string> {
    let user = await this.userService.getUserByProviderId(providerId);
    // if (user) {
    //   throw new ConflictException('Utilisateur déjà enregistré');
    // }
    if (!user) {
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
        googleAccessToken: data.accessToken,
      });
    }
    const payload = {
      thirdPartyId: providerId,
      provider,
    };
    const jwt: string = sign(payload, this.config.jwt.secretKey, {
      expiresIn: this.config.jwt.expires,
    });
    return jwt;
  }
}
