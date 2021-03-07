import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../state/auth.state';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly store: Store, private readonly router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isAuthenticated = this.store.selectSnapshot(
      AuthState.isAuthenticated
    );
    if (!isAuthenticated) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
    }
    return isAuthenticated;
  }
}
