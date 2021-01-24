import * as Joi from 'joi';

export const DEFAULT_SCOPES =
  'profile,email,https://www.googleapis.com/auth/youtube,https://www.googleapis.com/auth/youtube.force-ssl';
export const DEFAULT_JWT_EXPIRES = '7d';

export const VALIDATION_SCHEMA = Joi.object({
  CLIENT_ID: Joi.string().required(),
  CLIENT_SECRET: Joi.string().required(),
  REDIRECT_URL: Joi.string().required(),
  SCOPES: Joi.string().required().default(DEFAULT_SCOPES),
  GOOGLE_SUCCESS_LOGIN_URL: Joi.string().required(),
  GOOGLE_FAILURE_LOGIN_URL: Joi.string().required(),
  JWT_SECRET_KEY: Joi.string().required(),
  JWT_EXPIRES: Joi.string().required().default(DEFAULT_JWT_EXPIRES),
});
