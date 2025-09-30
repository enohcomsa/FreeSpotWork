import { z } from "zod";
import { ObjectIdStr, PreferredLanguage, PreferredTheme, UserRole } from "./common.zod";

export const UserIdParam = z.object({
  id: ObjectIdStr,
});

export const UserCreate = z.object({
  email: z.string().email().min(3),
  firstName: z.string().min(1),
  familyName: z.string().min(1),
  role: UserRole,
  preferredLanguage: PreferredLanguage.nullable().optional(),
  preferredTheme: PreferredTheme.nullable().optional(),
  facultyId: ObjectIdStr,
  programYearId: ObjectIdStr,
  groupCohortId: ObjectIdStr,
  semigroupCohortId: ObjectIdStr.nullable().optional(),
});

export const UserUpdate = z.object({
  firstName: z.string().min(1).optional(),
  familyName: z.string().min(1).optional(),
  role: UserRole.optional(),
  preferredLanguage: PreferredLanguage.nullable().optional(),
  preferredTheme: PreferredTheme.nullable().optional(),
  facultyId: ObjectIdStr.optional(),
  programYearId: ObjectIdStr.optional(),
  groupCohortId: ObjectIdStr.optional(),
  semigroupCohortId: ObjectIdStr.nullable().optional(),
})
  .refine(v => Object.keys(v).length > 0, {
    message: "Provide at least one field to update",
  });

export const UserResponse = z.object({
  id: ObjectIdStr,
  email: z.string().email(),
  firstName: z.string(),
  familyName: z.string(),
  role: UserRole,
  preferredLanguage: PreferredLanguage.nullable().optional(),
  preferredTheme: PreferredTheme.nullable().optional(),
  facultyId: ObjectIdStr,
  programYearId: ObjectIdStr,
  groupCohortId: ObjectIdStr,
  semigroupCohortId: ObjectIdStr.nullable().optional(),
});

export type UserCreateInput = z.infer<typeof UserCreate>;
export type UserUpdateInput = z.infer<typeof UserUpdate>;
export type UserIdParamInput = z.infer<typeof UserIdParam>;
export type UserResponseDto = z.infer<typeof UserResponse>;
