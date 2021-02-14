export namespace AuthActions {
  export class ResetStatus {
    static readonly type = '[Auth] ResetStatus';
  }

  export class SetStatus {
    static readonly type = '[Auth] SetStatus';

    constructor(public status: number) {}
  }
  export class InitRegistration {
    static readonly type = '[Auth] InitRegistration';

    constructor(public token: string) {}
  }

  export class LoadUserProfile {
    static readonly type = '[Auth] LoadUserProfile';
  }

  export class Register {
    static readonly type = '[Auth] Register';

    constructor(
      public user: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
      }
    ) {}
  }

  export class Login {
    static readonly type = '[Auth] Login';
    constructor(public username: string, public password: string) {}
  }

  export class Logout {
    static readonly type = '[Auth] Logout';
  }
}
