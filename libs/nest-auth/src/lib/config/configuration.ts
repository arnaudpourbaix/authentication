import { AuthConfig } from '@authentication/common-auth';

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
    successLoginUrl: process.env.GOOGLE_SUCCESS_LOGIN_URL ?? '',
    failureLoginUrl: process.env.GOOGLE_FAILURE_LOGIN_URL ?? '',
  },
});
