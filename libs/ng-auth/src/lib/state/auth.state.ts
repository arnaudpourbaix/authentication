import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@authentication/common-auth';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthModuleConfig, AUTH_CONFIG } from '../config/module.config';
import { createErrorResponse, ErrorResponse } from '../utils/error-response';
import { AuthActions } from './auth.action';
import { AUTH_STATE_NAME } from './auth.model';

interface StateModel {
  token?: string;
  user?: User;
  errorResponse?: ErrorResponse;
}

@State<StateModel>({
  name: AUTH_STATE_NAME,
  defaults: {},
})
@Injectable()
export class AuthState {
  constructor(
    private readonly http: HttpClient,
    private readonly snackBar: MatSnackBar,
    @Inject(AUTH_CONFIG) private readonly config: AuthModuleConfig
  ) {}

  @Selector()
  static errorResponse(
    state: StateModel
  ): { status: number; message: string } | undefined {
    return state.errorResponse;
  }

  @Selector()
  static token(state: StateModel): string | undefined {
    return state.token;
  }

  @Selector()
  static isAuthenticated(state: StateModel): boolean {
    return !!state.token;
  }

  @Selector()
  static user(state: StateModel) {
    return state.user;
  }

  @Action(AuthActions.ResetStatus)
  resetStatus(ctx: StateContext<StateModel>) {
    ctx.patchState({ errorResponse: undefined });
  }

  @Action(AuthActions.Login)
  login(ctx: StateContext<StateModel>, action: AuthActions.Login) {
    return this.http
      .post<{ token: string }>(`v1/auth/login`, {
        email: action.email,
        password: action.password,
      })
      .pipe(
        switchMap((res) => {
          ctx.patchState({
            token: res.token,
            errorResponse: undefined,
          });
          return ctx.dispatch(new AuthActions.LoadUserProfile());
        }),
        catchError((error: HttpErrorResponse) => {
          ctx.patchState({
            token: undefined,
            errorResponse: createErrorResponse(error),
          });
          return throwError(error);
        })
      );
  }

  @Action(AuthActions.Logout)
  logout(ctx: StateContext<StateModel>) {
    ctx.patchState({ token: undefined, user: undefined });
  }

  @Action(AuthActions.InitPasswordChange)
  initPasswordChange(
    ctx: StateContext<StateModel>,
    action: AuthActions.InitPasswordChange
  ) {
    if (action.token) {
      ctx.patchState({
        token: action.token,
      });
    }
    return ctx
      .dispatch(new AuthActions.ResetStatus())
      .pipe(switchMap(() => ctx.dispatch(new AuthActions.LoadUserProfile())));
  }

  @Action(AuthActions.ChangePassword)
  changePassword(
    ctx: StateContext<StateModel>,
    action: AuthActions.ChangePassword
  ) {
    return this.http.post<any>(`v1/auth/password`, action.user).pipe(
      tap(() => {
        this.snackBar.open('Le mot de passe a été changé', undefined, {
          duration: 3000,
          verticalPosition: 'top',
        });
      }),
      catchError((error: HttpErrorResponse) => {
        ctx.patchState({
          errorResponse: createErrorResponse(error),
        });
        return throwError(error);
      })
    );
  }

  @Action(AuthActions.LoadUserProfile)
  loadUserProfile(ctx: StateContext<StateModel>) {
    return this.http.get<User>(`v1/auth/profile`).pipe(
      map((user) => {
        ctx.patchState({
          user,
        });
        return user;
      }),
      catchError((error: HttpErrorResponse) => {
        ctx.patchState({
          errorResponse: createErrorResponse(error),
        });
        return throwError(error);
      })
    );
  }

  @Action(AuthActions.UpdateUserProfile)
  updateUserProfile(
    ctx: StateContext<StateModel>,
    action: AuthActions.UpdateUserProfile
  ) {
    return this.http.post<User>(`v1/auth/profile`, action.user).pipe(
      map((user) => {
        ctx.patchState({
          user,
          errorResponse: undefined,
        });
        return user;
      }),
      catchError((error: HttpErrorResponse) => {
        ctx.patchState({
          errorResponse: createErrorResponse(error),
        });
        return throwError(error);
      })
    );
  }
}
