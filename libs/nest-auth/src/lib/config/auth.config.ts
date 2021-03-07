import { registerAs } from '@nestjs/config';
import { DEFAULT_JWT_EXPIRES, DEFAULT_SCOPES } from './schema';

export default registerAs('auth', () => ({
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY as string,
    expires: process.env.JWT_EXPIRES ?? DEFAULT_JWT_EXPIRES,
  },
  google: {
    clientId: process.env.CLIENT_ID as string,
    clientSecret: process.env.CLIENT_SECRET as string,
    redirectUrl: process.env.REDIRECT_URL as string,
    scopes: (process.env.SCOPES ?? DEFAULT_SCOPES).split(','),
    successLoginUrl: process.env.GOOGLE_SUCCESS_LOGIN_URL as string,
    failureLoginUrl: process.env.GOOGLE_FAILURE_LOGIN_URL as string,
  },
}));
