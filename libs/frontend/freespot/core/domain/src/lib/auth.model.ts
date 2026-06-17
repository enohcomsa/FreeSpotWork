export type Role = 'MEMBER' | 'ADMIN';

export interface AuthOk {
  xsrfToken: string | null;
}

export interface RefreshSessionResult {
  xsrfToken: string | null;
}

export interface LoginCmd {
  identifier: string;
  password: string;
}

export interface SignupCmd {
  email: string;
  password: string;
  username: string;
}
