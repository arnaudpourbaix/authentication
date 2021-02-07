import {
  AfterViewInit,
  Component,
  ElementRef,
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
import { AuthActions } from '../../state/auth.action';
import { AuthState } from '../../state/auth.state';
import { FormGroupTyped } from '../../utils/typed-form';
import { MustMatchValidator } from '../../validators/must-match.validator';

@Component({
  selector: 'apx-auth-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();

  passwordMinlength = 3;

  @Select(AuthState.responseStatus)
  responseStatus$: Observable<number | undefined> | undefined;

  @ViewChild('username')
  usernameInput: ElementRef | undefined;

  form = this.formBuilder.group(
    {
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: [
        '',
        [Validators.required, Validators.minLength(this.passwordMinlength)],
      ],
      confirmPassword: ['', Validators.required],
    },
    {
      updateOn: 'submit',
      validators: MustMatchValidator('password', 'confirmPassword'),
    }
  ) as FormGroupTyped<{
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>;

  loading$: Observable<boolean> | undefined;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly actions$: Actions
  ) {}

  ngOnInit() {
    this.store.dispatch(new AuthActions.InitRegistration());
    this.loading$ = merge(
      this.actions$.pipe(
        ofActionDispatched(AuthActions.Register),
        map(() => true)
      ),
      this.actions$.pipe(
        ofActionCompleted(AuthActions.Register),
        map(() => false)
      )
    ).pipe(takeUntil(this.destroy$), startWith(false));
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.usernameInput) {
        this.usernameInput.nativeElement.focus();
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
    this.store.dispatch(
      new AuthActions.Register({
        username: this.form.controls.username.value,
        email: this.form.controls.email.value,
        password: this.form.controls.password.value,
      })
    );
  }
}
