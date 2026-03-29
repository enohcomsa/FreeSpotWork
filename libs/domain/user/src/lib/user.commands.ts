import { Role, Language, Theme } from '@free-spot/enums';

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
