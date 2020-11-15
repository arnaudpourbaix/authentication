import { User } from '@authentification/common-auth';

export const AUTH_STATE_NAME = 'auth';

export interface AuthStateModel {
  token: string | null;
  user: User | null;
  responseStatus: number | undefined;
}
