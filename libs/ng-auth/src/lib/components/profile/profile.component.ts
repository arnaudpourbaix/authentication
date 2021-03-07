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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();

  @Select(AuthState.errorResponse)
  error$:
    | Observable<{ status: number; message: string } | undefined>
    | undefined;

  @ViewChild('password')
  passwordInput: ElementRef | undefined;

  form = this.formBuilder.group(
    {
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    },
    {
      updateOn: 'submit',
    }
  ) as FormGroupTyped<{
    email: string;
    firstName: string;
    lastName: string;
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
      .dispatch(new AuthActions.InitPasswordChange(token))
      .subscribe(() => {
        const user = this.store.selectSnapshot(AuthState.user) as User;
        this.form.controls.email.patchValue(user.email);
        this.form.controls.firstName.patchValue(user.firstName);
        this.form.controls.lastName.patchValue(user.lastName);
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
      new AuthActions.UpdateUserProfile({
        email: this.form.controls.email.value,
        firstName: this.form.controls.firstName.value,
        lastName: this.form.controls.lastName.value,
      })
    );
  }
}
