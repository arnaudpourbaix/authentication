import { AuthConfig, JwtConfig } from '@authentication/common-auth';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import configuration from './config/configuration';
import { AuthController } from './controllers/auth.controller';
import { GoogleAuthGuard } from './passport/google/guard';
import { GoogleStrategy } from './passport/google/strategy';
import { JwtAuthGuard } from './passport/jwt/guard';
import { JwtStrategy } from './passport/jwt/strategy';
import { LocalAuthGuard } from './passport/local/guard';
import { LocalStrategy } from './passport/local/strategy';
import { AuthService } from './services/auth.service';
import { UserModule } from './user/user.module';

@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule.forFeature(configuration),
    UserModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<AuthConfig>) => ({
        secret: configService.get<JwtConfig>('jwt')?.secretKey,
        signOptions: {
          expiresIn: configService.get<JwtConfig>('jwt')?.expires,
        },
      }),
    }),
    UserModule,
  ],
  providers: [
    AuthService,
    GoogleAuthGuard,
    GoogleStrategy,
    JwtAuthGuard,
    JwtStrategy,
    LocalAuthGuard,
    LocalStrategy,
  ],
  exports: [PassportModule],
})
export class NestAuthModule {}
