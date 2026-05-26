import { type Role } from './auth.model';
import { type Language, type Theme } from './user-preferences.model';

export type UpdateUserCmd = Partial<{
  username: string | null;
  firstName: string | null;
  familyName: string | null;
  role: Role;
  preferredLanguage: Language | null;
  preferredTheme: Theme | null;
  facultyId: string | null;
  programId: string | null;
  programYearId: string | null;
  groupCohortId: string | null;
  semigroupCohortId: string | null;
}>;
