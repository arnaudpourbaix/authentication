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
  selector: 'apx-auth-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();

  passwordMinlength = 3;

  @Select(AuthState.errorResponse)
  error$:
    | Observable<{ status: number; message: string } | undefined>
    | undefined;

  @ViewChild('oldPassword')
  oldPasswordInput: ElementRef | undefined;

  @ViewChild('newPassword')
  newPasswordInput: ElementRef | undefined;

  creation = false;
  title: string | undefined;

  form = this.formBuilder.group(
    {
      oldPassword: ['', Validators.required],
      newPassword: [
        '',
        [Validators.required, Validators.minLength(this.passwordMinlength)],
      ],
      confirmPassword: ['', Validators.required],
    },
    {
      updateOn: 'submit',
      validators: MustMatchValidator('newPassword', 'confirmPassword'),
    }
  ) as FormGroupTyped<{
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>;

  loading$: Observable<boolean> | undefined;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store,
    private readonly actions$: Actions
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];
    this.creation = !!token;
    if (this.creation) {
      this.form.controls.oldPassword.clearValidators();
      //   this.form.controls.oldPassword.updateValueAndValidity();
    }
    this.title = this.creation
      ? 'Créer un nouveau mot de passe'
      : 'Modifier votre mot de passe';
    this.store
      .dispatch(new AuthActions.InitPasswordChange(token))
      .subscribe(() => {
        const user = this.store.selectSnapshot(AuthState.user) as User;
      });
    this.loading$ = merge(
      this.actions$.pipe(
        ofActionDispatched(AuthActions.UpdateUserProfile),
        map(() => true)
      ),
      this.actions$.pipe(
        ofActionCompleted(AuthActions.UpdateUserProfile),
        map(() => false)
      )
    ).pipe(takeUntil(this.destroy$), startWith(false));
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.oldPasswordInput) {
        this.oldPasswordInput.nativeElement.focus();
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
        new AuthActions.ChangePassword({
          oldPassword: this.form.controls.oldPassword.value,
          newPassword: this.form.controls.newPassword.value,
        })
      )
      .subscribe(() => {
        this.router.navigate(['/profile']);
      });
  }
}
