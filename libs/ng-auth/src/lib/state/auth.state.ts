import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { User } from '@authentication/common-auth';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthModuleConfig, AUTH_CONFIG } from '../config/module.config';
import { AuthActions } from './auth.action';
import { AuthStateModel, AUTH_STATE_NAME } from './auth.model';

@State<AuthStateModel>({
  name: AUTH_STATE_NAME,
  defaults: {
    token: null,
    user: null,
    responseStatus: undefined,
  },
})
@Injectable()
export class AuthState {
  constructor(
    private readonly http: HttpClient,
    @Inject(AUTH_CONFIG) private readonly config: AuthModuleConfig
  ) {}

  @Selector()
  static responseStatus(state: AuthStateModel): number | undefined {
    return state.responseStatus;
  }

  @Selector()
  static token(state: AuthStateModel): string | null {
    return state.token;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return !!state.token;
  }

  @Selector()
  static user(state: AuthStateModel) {
    return state.user;
  }

  @Action(AuthActions.ResetStatus)
  resetStatus(ctx: StateContext<AuthStateModel>, action: AuthActions.Logout) {
    ctx.patchState({ responseStatus: undefined });
  }

  @Action(AuthActions.InitRegistration)
  initRegistration(
    ctx: StateContext<AuthStateModel>,
    action: AuthActions.Logout
  ) {
    return ctx
      .dispatch(new AuthActions.ResetStatus())
      .pipe(switchMap(() => ctx.dispatch(new AuthActions.GetUser())));
  }

  @Action(AuthActions.GetUser)
  getUser(ctx: StateContext<AuthStateModel>, action: AuthActions.Logout) {
    return this.http.get<any>(`v1/auth/profile`).pipe(
      map((result) => {
        console.log(result);
      }),
      catchError((error: HttpErrorResponse) => {
        ctx.patchState({
          responseStatus: error.status,
        });
        return throwError(error);
      })
    );
  }

  @Action(AuthActions.Register)
  register(ctx: StateContext<AuthStateModel>, action: AuthActions.Register) {
    return this.http.post<any>(`v1/auth/register`, action.user).pipe(
      map((result) => {
        console.log(result);
        document.location.href = `v1/auth/google`;
        //   ctx.patchState({
        //     user,
        //     token: user.accessToken,
        //     responseStatus: undefined,
        //   });
        //   return user;
      }),
      catchError((error: HttpErrorResponse) => {
        ctx.patchState({
          responseStatus: error.status,
        });
        return throwError(error);
      })
    );
  }

  @Action(AuthActions.Login)
  login(ctx: StateContext<AuthStateModel>, action: AuthActions.Login) {
    return this.http
      .post<User>(`v1/auth/login`, {
        username: action.username,
        password: action.password,
      })
      .pipe(
        map((user) => {
          ctx.patchState({
            user,
            token: user.accessToken,
            responseStatus: undefined,
          });
          return user;
        }),
        catchError((error: HttpErrorResponse) => {
          ctx.patchState({
            responseStatus: error.status,
          });
          return throwError(error);
        })
      );
  }

  @Action(AuthActions.Logout)
  logout(ctx: StateContext<AuthStateModel>, action: AuthActions.Logout) {
    ctx.patchState({ token: null, user: null });
  }
}
