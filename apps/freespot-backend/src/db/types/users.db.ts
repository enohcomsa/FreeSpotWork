import { ObjectId } from "mongodb";
import type { PreferredLanguageT, PreferredThemeT, UserRoleT } from "../../schemas/common.zod";

export type UserDbBase = {
  email: string;
  firstName: string;
  familyName: string;
  role: UserRoleT;
  preferredLanguage?: PreferredLanguageT | null;
  preferredTheme?: PreferredThemeT | null;
  facultyId: ObjectId;
  programYearId: ObjectId;
  groupCohortId: ObjectId;
  semigroupCohortId?: ObjectId | null;
};

export type UserDbDoc = UserDbBase & { _id: ObjectId };
export type UserDbRecord = UserDbBase;
