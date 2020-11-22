export interface User {
  id: string;
  username: string;
  displayName: string;
  photoUrl?: string | null;
  accessToken?: string;
}
