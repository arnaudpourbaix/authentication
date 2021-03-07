import { Component } from '@angular/core';
import { AuthActions, AuthState } from '@authentication/ng-auth';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @Select(AuthState.isAuthenticated)
  isAuthenticated$: Observable<boolean> | undefined;

  constructor(private readonly store: Store) {}

  logout() {
    this.store.dispatch(new AuthActions.Logout());
  }
}
