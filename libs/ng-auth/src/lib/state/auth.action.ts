export namespace AuthActions {
  export class ResetStatus {
    static readonly type = '[Auth] ResetStatus';
  }

  export class InitRegistration {
    static readonly type = '[Auth] InitRegistration';

    constructor() {}
  }

  export class GetUser {
    static readonly type = '[Auth] GetUser';

    constructor() {}
  }

  export class Register {
    static readonly type = '[Auth] Register';

    constructor(
      public user: { username: string; password: string; email: string }
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
