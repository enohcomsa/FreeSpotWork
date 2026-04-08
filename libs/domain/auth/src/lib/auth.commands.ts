export interface LoginCmd {
  identifier: string;
  password: string;
}

export interface SignupCmd {
  email: string;
  password: string;
  username: string;
}
