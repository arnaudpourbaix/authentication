import { AuthConfig } from '@authentification/common-auth';

export default (): AuthConfig => ({
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY ?? '',
    expires: process.env.JWT_EXPIRES ?? '',
  },
  google: {
    clientId: process.env.CLIENT_ID ?? '',
    clientSecret: process.env.CLIENT_SECRET ?? '',
    redirectUrl: process.env.REDIRECT_URL ?? '',
    scopes: (process.env.SCOPES ?? '').split(','),
  },
  login: { loginSuccessUrl: process.env.LOGIN_SUCCESS_URL ?? '' },
});
