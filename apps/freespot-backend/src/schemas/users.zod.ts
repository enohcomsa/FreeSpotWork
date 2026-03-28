import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ObjectIdStr, PreferredLanguage, PreferredTheme, UserRole } from "./common.zod";
import { strictObj, nonEmptyDefinedPatch } from "../utils/zod-helpers";

extendZodWithOpenApi(z);

export const UserBase = strictObj({
  email: z.string().email().min(3),
  username: z.string().trim().min(3).max(50).nullable().optional(),
  firstName: z.string().trim().min(1).nullable(),
  familyName: z.string().trim().min(1).nullable(),
  role: UserRole,

  preferredLanguage: PreferredLanguage.nullable().optional(),
  preferredTheme: PreferredTheme.nullable().optional(),

  facultyId: ObjectIdStr.nullable(),
  programId: ObjectIdStr.nullable(),
  programYearId: ObjectIdStr.nullable(),
  groupCohortId: ObjectIdStr.nullable(),
  semigroupCohortId: ObjectIdStr.nullable().optional(),
}).openapi("UserBase");

export const UserIdParam = z.object({ id: ObjectIdStr }).openapi("UserIdParam");
export const UserCreate = UserBase.openapi("UserCreate");
export const UserUpdate = nonEmptyDefinedPatch(UserBase.partial().omit({ email: true })).openapi("UserUpdate");

export const UserMeProfileUpdate = strictObj({
  firstName: z.string().trim().min(1),
  familyName: z.string().trim().min(1),
  facultyId: ObjectIdStr,
  programId: ObjectIdStr,
  programYearId: ObjectIdStr,
  groupCohortId: ObjectIdStr,
  semigroupCohortId: ObjectIdStr.nullable().optional(),
}).openapi("UserMeProfileUpdate");

export const UserResponse = UserBase.extend({ id: ObjectIdStr }).openapi("UserResponse");
export const UserList = z.array(UserResponse).openapi("UserList");

export type UserBaseT = z.infer<typeof UserBase>;
export type UserCreateRequest = z.infer<typeof UserCreate>;
export type UserUpdateRequest = z.infer<typeof UserUpdate>;
export type UserMeProfileUpdateRequest = z.infer<typeof UserMeProfileUpdate>;
export type UserIdParamT = z.infer<typeof UserIdParam>;
export type UserResponseDto = z.infer<typeof UserResponse>;
