import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule, authProviders } from '@authentication/ng-auth';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

const uiModules = [MatButtonModule];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxsModule.forRoot([], {
      developmentMode: !environment.production,
      selectorOptions: { suppressErrors: false },
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    AuthModule.forRoot({
      serverUrl: environment.serverUrl,
    }),
    uiModules,
  ],
  providers: [...authProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
