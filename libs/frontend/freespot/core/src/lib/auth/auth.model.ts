import { Language, Theme } from '../user-preferences/user-preferences.model';

export enum Role {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  username?: string | null;
  firstName: string | null;
  familyName: string | null;
  role: Role;
  preferredLanguage?: Language | null;
  preferredTheme?: Theme | null;
  facultyId: string | null;
  programId: string | null;
  programYearId: string | null;
  groupCohortId: string | null;
  semigroupCohortId?: string | null;
}

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
