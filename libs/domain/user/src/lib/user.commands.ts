import { Language } from "./language.enum";
import { Role } from "./role.enum";
import { Theme } from "./theme.enum";


export type UpdateMyProfileCmd = {
  firstName: string;
  familyName: string;
  facultyId: string;
  programId: string;
  programYearId: string;
  groupCohortId: string;
  semigroupCohortId?: string | null;
};

export type UpdateMyPreferencesCmd = {
  preferredLanguage?: Language | null;
  preferredTheme?: Theme | null;
};

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
