export interface AuthOk {
  xsrfToken: string | null;
}

export interface RefreshSessionResult {
  xsrfToken: string | null;
}
