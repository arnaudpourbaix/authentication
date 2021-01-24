import {
  DynamicModule,
  ForwardReference,
  Module,
  Provider,
  Type,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  AuthModuleAsyncOptions,
  AuthModuleOptions,
  AuthOptionsFactory,
  IAuthModuleOptions,
} from './config/module.options';
import { AuthController } from './controllers/auth.controller';
import { GoogleAuthGuard } from './passport/google/guard';
import { GoogleStrategy } from './passport/google/strategy';
import { JwtAuthGuard } from './passport/jwt/guard';
import { JwtStrategy } from './passport/jwt/strategy';
import { LocalAuthGuard } from './passport/local/guard';
import { LocalStrategy } from './passport/local/strategy';
import { AuthService } from './services/auth.service';
import { UserModule } from './user/user.module';

@Module({})
export class NestAuthModule {
  static register(options: IAuthModuleOptions): DynamicModule {
    return this.createModule(
      [{ provide: AuthModuleOptions, useValue: options }],
      []
    );
  }

  static registerAsync(options: AuthModuleAsyncOptions): DynamicModule {
    return this.createModule(
      this.createAsyncProviders(options),
      options.imports || []
    );
  }

  private static createModule(
    providers: Provider[],
    imports: Array<
      Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >
  ) {
    console.log('createModule', providers[0]);
    return {
      module: NestAuthModule,
      controllers: [AuthController],
      providers: [
        ...providers,
        AuthService,
        GoogleAuthGuard,
        GoogleStrategy,
        JwtAuthGuard,
        JwtStrategy,
        LocalAuthGuard,
        LocalStrategy,
      ],
      imports: [
        ...imports,
        UserModule,
        PassportModule.register({
          defaultStrategy: 'jwt',
          property: 'user',
          session: false,
        }),
        JwtModule.registerAsync({
          inject: [AuthModuleOptions],
          useFactory: async (options: AuthModuleOptions) => {
            console.log('JwtModule.registerAsync', options);
            return {
              secret: options.jwt.secretKey,
              signOptions: {
                expiresIn: options.jwt.expires,
              },
            };
          },
        }),
      ],
      exports: [AuthModuleOptions, PassportModule],
    };
  }

  private static createAsyncProviders(
    options: AuthModuleAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    } else if (options.useClass) {
      return [
        this.createAsyncOptionsProvider(options),
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
      ];
    }
    throw new Error('missing provider config');
  }

  private static createAsyncOptionsProvider(
    options: AuthModuleAsyncOptions
  ): Provider {
    const useFactory =
      options.useFactory ??
      (async (optionsFactory: AuthOptionsFactory) =>
        await optionsFactory.createAuthOptions());
    const inject = options.useFactory
      ? options.inject || []
      : [options.useExisting || options.useClass];
    return {
      provide: AuthModuleOptions,
      useFactory,
      inject,
    };
  }
}
