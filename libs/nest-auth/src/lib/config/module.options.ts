import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

export interface IAuthModuleOptions {
  jwt: {
    secretKey: string;
    expires: string;
  };
  google: {
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
    scopes: string[];
    successLoginUrl: string;
    failureLoginUrl: string;
  };
  [key: string]: any;
}

export interface AuthOptionsFactory {
  createAuthOptions(): Promise<IAuthModuleOptions> | IAuthModuleOptions;
}

export interface AuthModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<AuthOptionsFactory>;
  useClass?: Type<AuthOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<IAuthModuleOptions> | IAuthModuleOptions;
  inject?: any[];
}

export class AuthModuleOptions implements IAuthModuleOptions {
  jwt!: {
    secretKey: string;
    expires: string;
  };
  google!: {
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
    scopes: string[];
    successLoginUrl: string;
    failureLoginUrl: string;
  };
}
