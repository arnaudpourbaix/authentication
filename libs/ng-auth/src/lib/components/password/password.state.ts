import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { User } from '@authentication/common-auth';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PASSWORD_STATE_NAME } from '../../state/auth.model';
import { AuthModuleConfig, AUTH_CONFIG } from '../../config/module.config';

interface StateModel {
  errorResponse?: { status: number; message: string };
}

@State<StateModel>({
  name: PASSWORD_STATE_NAME,
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

  //   @Action(AuthActions.ResetStatus)
  //   resetStatus(ctx: StateContext<StateModel>) {
  //     ctx.patchState({ responseStatus: undefined });
  //   }

  //   @Action(AuthActions.SetStatus)
  //   setStatus(ctx: StateContext<StateModel>, action: AuthActions.SetStatus) {
  //     ctx.patchState({ responseStatus: action.status });
  //   }

  //   @Action(AuthActions.InitPasswordChange)
  //   initPasswordChange(
  //     ctx: StateContext<StateModel>,
  //     action: AuthActions.InitPasswordChange
  //   ) {
  //     if (action.token) {
  //       ctx.patchState({
  //         token: action.token,
  //       });
  //     }
  //     return ctx
  //       .dispatch(new AuthActions.ResetStatus())
  //       .pipe(switchMap(() => ctx.dispatch(new AuthActions.LoadUserProfile())));
  //   }

  //   @Action(AuthActions.ChangePassword)
  //   changePassword(
  //     ctx: StateContext<StateModel>,
  //     action: AuthActions.ChangePassword
  //   ) {
  //     return this.http.post<any>(`v1/auth/password`, action.user).pipe(
  //       tap(() => {
  //         this.snackBar.open('Le mot de passe a été changé', undefined, {
  //           duration: 3000,
  //           verticalPosition: 'top',
  //         });
  //       }),
  //       catchError((error: HttpErrorResponse) => {
  //         console.error(error);
  //         ctx.patchState({
  //           responseStatus: error.status,
  //         });
  //         return throwError(error);
  //       })
  //     );
  //   }
}
