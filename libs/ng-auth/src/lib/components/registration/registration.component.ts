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
import { User } from '@authentication/common-auth';
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

  @ViewChild('password')
  passwordInput: ElementRef | undefined;

  form = this.formBuilder.group(
    {
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
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
    email: string;
    firstName: string;
    lastName: string;
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
    const token = this.route.snapshot.queryParams['token'];
    this.store
      .dispatch(new AuthActions.InitRegistration(token))
      .subscribe(() => {
        const user = this.store.selectSnapshot(AuthState.user) as User;
        this.form.controls.email.patchValue(user.email);
        this.form.controls.firstName.patchValue(user.firstName);
        this.form.controls.lastName.patchValue(user.lastName);
      });
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
      if (this.passwordInput) {
        this.passwordInput.nativeElement.focus();
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
        email: this.form.controls.email.value,
        password: this.form.controls.password.value,
        // firstName: this.form.controls.firstName.value,
        firstName: null as any,
        lastName: this.form.controls.lastName.value,
      })
    );
  }
}
