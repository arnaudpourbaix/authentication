import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { AppRoutingModule } from './app-routing.module';
import { LoginModule } from './components/login/login.module';
import { UserModule } from './components/user/user.module';
import { AuthModuleConfig, AUTH_CONFIG } from './config/module.config';
import { AuthState } from './state/auth.state';

@NgModule({
  imports: [
    LoginModule,
    UserModule,
    AppRoutingModule,
    MatSnackBarModule,
    NgxsModule.forFeature([AuthState]),
    NgxsStoragePluginModule.forRoot({
      key: AuthState,
    }),
  ],
  exports: [LoginModule, UserModule],
})
export class AuthModule {
  public static forRoot(
    config: AuthModuleConfig
  ): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        {
          provide: AUTH_CONFIG,
          useValue: config,
        },
      ],
    };
  }
}
