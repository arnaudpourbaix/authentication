import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@authentication/common-auth';
import { Actions, ofActionDispatched, Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthActions } from '../../state/auth.action';
import { AuthState } from '../../state/auth.state';

@Component({
  selector: 'apx-auth-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  @Select(AuthState.user)
  user$: Observable<User> | undefined;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly actions$: Actions
  ) {}

  ngOnInit(): void {
    this.actions$.pipe(ofActionDispatched(AuthActions.Logout)).subscribe(() => {
      if (!this.router.url.startsWith('/login')) {
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: this.router.url },
        });
      }
    });
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
  }
}
