import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { User } from '@authentication/common-auth';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LOGIN_STATE_NAME } from '../../state/auth.model';
import { AuthModuleConfig, AUTH_CONFIG } from '../../config/module.config';
import { AuthActions } from '../../state/auth.action';

interface StateModel {
  errorResponse?: { status: number; message: string };
}

@State<StateModel>({
  name: LOGIN_STATE_NAME,
  defaults: {},
})
@Injectable()
export class LoginState {
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

  //   @Action(AuthActions.ResetStatus)
  //   resetStatus(ctx: StateContext<StateModel>) {
  //     ctx.patchState({ responseStatus: undefined });
  //   }

  //   @Action(AuthActions.SetStatus)
  //   setStatus(ctx: StateContext<StateModel>, action: AuthActions.SetStatus) {
  //     ctx.patchState({ responseStatus: action.status });
  //   }

  //   @Action(AuthActions.Login)
  //   login(ctx: StateContext<StateModel>, action: AuthActions.Login) {
  //     return this.http
  //       .post(
  //         `v1/auth/login`,
  //         {
  //           email: action.email,
  //           password: action.password,
  //         },
  //         { responseType: 'text' }
  //       )
  //       .pipe(
  //         switchMap((token) => {
  //           ctx.patchState({
  //             token,
  //             responseStatus: undefined,
  //           });
  //           return ctx.dispatch(new AuthActions.LoadUserProfile());
  //         }),
  //         catchError((error: HttpErrorResponse) => {
  //           ctx.patchState({
  //             token: undefined,
  //             responseStatus: error.status,
  //           });
  //           return throwError(error);
  //         })
  //       );
  //   }

  //   @Action(AuthActions.Logout)
  //   logout(ctx: StateContext<StateModel>) {
  //     ctx.patchState({ token: undefined, user: undefined });
  //   }
}
