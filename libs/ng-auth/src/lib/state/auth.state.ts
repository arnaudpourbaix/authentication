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
  defaults: {},
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
  static token(state: AuthStateModel): string | undefined {
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
  resetStatus(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({ responseStatus: undefined });
  }

  @Action(AuthActions.SetStatus)
  setStatus(ctx: StateContext<AuthStateModel>, action: AuthActions.SetStatus) {
    ctx.patchState({ responseStatus: action.status });
  }

  @Action(AuthActions.InitRegistration)
  initRegistration(
    ctx: StateContext<AuthStateModel>,
    action: AuthActions.InitRegistration
  ) {
    ctx.patchState({
      token: action.token,
    });
    return ctx
      .dispatch(new AuthActions.ResetStatus())
      .pipe(switchMap(() => ctx.dispatch(new AuthActions.LoadUserProfile())));
  }

  @Action(AuthActions.LoadUserProfile)
  loadUserProfile(ctx: StateContext<AuthStateModel>) {
    return this.http.get<User>(`v1/auth/profile`).pipe(
      map((user) => {
        ctx.patchState({
          user,
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

  @Action(AuthActions.Register)
  register(ctx: StateContext<AuthStateModel>, action: AuthActions.Register) {
    return this.http.post<any>(`v1/auth/register`, action.user).pipe(
      map((result) => {
        console.log('post register', result);
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
            // token: user.accessToken,
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
    ctx.patchState({ token: undefined, user: undefined });
  }
}
