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

@Component({
  selector: 'apx-auth-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();

  @Select(AuthState.responseStatus)
  responseStatus$: Observable<number | undefined> | undefined;

  @ViewChild('username')
  usernameInput: ElementRef | undefined;

  loginForm = this.formBuilder.group(
    {
      username: ['', Validators.required],
      password: ['', Validators.required],
    },
    { updateOn: 'submit' }
  ) as FormGroupTyped<{
    username: string;
    password: string;
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
      if (this.usernameInput) {
        this.usernameInput.nativeElement.focus();
      }
    }, 200);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  create() {
    this.store.dispatch(new AuthActions.Create());
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.store
      .dispatch(
        new AuthActions.Login(
          this.loginForm.controls.username.value,
          this.loginForm.controls.password.value
        )
      )
      .subscribe(() => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
      });
  }
}
