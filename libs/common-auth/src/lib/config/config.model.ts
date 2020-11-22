import { GoogleConfig } from './google-config.model';
import { JwtConfig } from './jwt-config.model';

export interface AuthConfig {
  jwt: JwtConfig;
  google: GoogleConfig;
}
