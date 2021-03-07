export namespace AuthActions {
  export class ResetStatus {
    static readonly type = '[Auth] ResetStatus';
  }

  export class InitPasswordChange {
    static readonly type = '[Auth] InitPasswordChange';

    constructor(public token: string) {}
  }

  export class ChangePassword {
    static readonly type = '[Auth] ChangePassword';

    constructor(
      public user: {
        oldPassword: string;
        newPassword: string;
      }
    ) {}
  }

  export class LoadUserProfile {
    static readonly type = '[Auth] LoadUserProfile';
  }

  export class UpdateUserProfile {
    static readonly type = '[Auth] UpdateUserProfile';

    constructor(
      public user: {
        email: string;
        firstName: string;
        lastName: string;
      }
    ) {}
  }

  export class Login {
    static readonly type = '[Auth] Login';
    constructor(public email: string, public password: string) {}
  }

  export class Logout {
    static readonly type = '[Auth] Logout';
  }
}
