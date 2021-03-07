import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Actions,
  ofActionCompleted,
  ofActionDispatched,
  Select,
  Store,
} from '@ngxs/store';
import { merge, Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { AuthModuleConfig, AUTH_CONFIG } from '../../config/module.config';
import { AuthActions } from '../../state/auth.action';
import { AuthState } from '../../state/auth.state';
import { FormGroupTyped } from '../../utils/typed-form';

@Component({
  selector: 'apx-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();

  @Select(AuthState.errorResponse)
  error$:
    | Observable<{ status: number; message: string } | undefined>
    | undefined;

  @ViewChild('email')
  emailInput: ElementRef | undefined;

  form = this.formBuilder.group(
    {
      email: ['', Validators.required],
      password: ['', Validators.required],
    },
    { updateOn: 'submit' }
  ) as FormGroupTyped<{
    email: string;
    password: string;
  }>;

  loading$: Observable<boolean> | undefined;

  loginUrl = `${this.config.serverUrl}/v1/auth/google`;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store,
    private readonly actions$: Actions,
    @Inject(AUTH_CONFIG) private readonly config: AuthModuleConfig
  ) {}

  ngOnInit() {
    this.store.dispatch(new AuthActions.ResetStatus());
    this.loading$ = merge(
      this.actions$.pipe(
        ofActionDispatched(AuthActions.Login),
        map(() => true)
      ),
      this.actions$.pipe(
        ofActionCompleted(AuthActions.Login),
        map(() => false)
      )
    ).pipe(takeUntil(this.destroy$), startWith(false));
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.emailInput) {
        this.emailInput.nativeElement.focus();
      }
    }, 200);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.store
      .dispatch(
        new AuthActions.Login(
          this.form.controls.email.value,
          this.form.controls.password.value
        )
      )
      .subscribe(() => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
      });
  }
}
