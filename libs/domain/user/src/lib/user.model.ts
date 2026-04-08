import { Language } from "./language.enum";
import { Role } from "./role.enum";
import { Theme } from "./theme.enum";

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
