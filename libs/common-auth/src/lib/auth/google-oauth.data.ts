export interface GoogleProfile {
  id: string;
  provider: string;
  displayName: string;
  emails: { value: string; verified: boolean }[];
  name?: { familyName: string; givenName: string };
  photos?: { value: string }[];
}

export interface GoogleOAuthData extends GoogleProfile {
  accessToken: string;
  refreshToken: string;
}
