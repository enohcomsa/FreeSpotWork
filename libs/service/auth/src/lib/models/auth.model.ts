export interface UserData {
  email: string;
  password: string;
  familyName?: string;
  firstName?: string;
}

export interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  register?: boolean;
}
