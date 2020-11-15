export namespace AuthActions {
  export class Create {
    static readonly type = '[Auth] Create';
  }

  export class Login {
    static readonly type = '[Auth] Login';
    constructor(public username: string, public password: string) {}
  }

  export class Logout {
    static readonly type = '[Auth] Logout';
  }
}
