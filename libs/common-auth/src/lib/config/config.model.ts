import { GoogleConfig } from './google-config.model';
import { JwtConfig } from './jwt-config.model';
import { LoginConfig } from './login.model';

export interface AuthConfig {
  jwt: JwtConfig;
  google: GoogleConfig;
  login: LoginConfig;
}
