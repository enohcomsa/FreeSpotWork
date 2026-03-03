import { ObjectId } from "mongodb";
import type { PreferredLanguageT, PreferredThemeT, UserAuthT, UserRoleT, UserSecurityT } from "../../schemas/common.zod";

export type UserDbBase = {
  email: string;
  username?: string | null;
  firstName: string | null;
  familyName: string | null;
  role: UserRoleT;

  preferredLanguage?: PreferredLanguageT | null;
  preferredTheme?: PreferredThemeT | null;

  facultyId: ObjectId | null;
  programYearId: ObjectId | null;
  groupCohortId: ObjectId | null;
  semigroupCohortId: ObjectId | null;

  emailVerified: boolean;
  auth: UserAuthT;
  security: UserSecurityT;

  createdAt: Date;
  updatedAt: Date;
};

export type UserDbDoc = UserDbBase & { _id: ObjectId };
export type UserDbRecord = UserDbBase;

export type UserAuthProjection = Pick<UserDbDoc,
  | "_id"
  | "email"
  | "username"
  | "role"
  | "emailVerified"
  | "auth"
  | "security"
>;

