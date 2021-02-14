import { TokenData } from './token-data';

export interface JwtPayload extends TokenData {
  iat?: number;
  exp?: number;
}
