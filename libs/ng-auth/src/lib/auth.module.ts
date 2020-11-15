import { NgModule } from '@angular/core';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { AppRoutingModule } from './app-routing.module';
import { LoginModule } from './components/login/login.module';
import { UserModule } from './components/user/user.module';
import { AuthState } from './state/auth.state';

@NgModule({
  imports: [
    LoginModule,
    UserModule,
    AppRoutingModule,
    NgxsModule.forFeature([AuthState]),
    NgxsStoragePluginModule.forRoot({
      key: AuthState,
    }),
  ],
  exports: [LoginModule, UserModule],
})
export class AuthModule {}
