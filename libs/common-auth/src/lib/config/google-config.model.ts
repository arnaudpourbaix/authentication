export interface GoogleConfig {
  clientId: string;
  clientSecret: string;
  scopes: string[];
  /**
   * From Google OAuth to backend server
   */
  redirectUrl: string;
  /**
   * Sucessful login from backend server to frontend server
   */
  successLoginUrl: string;
  /**
   * failed login from backend server to frontend server
   */
  failureLoginUrl: string;
}
