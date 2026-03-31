import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ObjectIdStr, PreferredLanguage, PreferredTheme, UserRole } from "./common.zod";
import { strictObj } from "../utils/zod-helpers";

extendZodWithOpenApi(z);

const Password = z.string().min(8).max(200);

export const SignupSchema = strictObj({
  email: z.string().email().min(3),
  password: Password,
  username: z.string().trim().min(3).max(50),
}).openapi("SignupRequest");

export const LoginSchema = strictObj({
  identifier: z.string().trim().min(3),
  password: Password,
}).openapi("LoginRequest");

export const AuthUserSchema = strictObj({
  id: ObjectIdStr,
  email: z.string().email(),
  role: UserRole,
  firstName: z.string().nullable(),
  familyName: z.string().nullable(),
  preferredLanguage: PreferredLanguage.nullable().optional(),
  preferredTheme: PreferredTheme.nullable().optional(),
  facultyId: ObjectIdStr.nullable(),
  programId: ObjectIdStr.nullable(),
  programYearId: ObjectIdStr.nullable(),
  groupCohortId: ObjectIdStr.nullable(),
  semigroupCohortId: ObjectIdStr.nullable().optional(),
}).openapi("AuthUser");

export const AuthOkResponse = strictObj({
  ok: z.literal(true),
  user: AuthUserSchema,
  xsrfToken: z.string(),
}).openapi("AuthOkResponse");

export const MeResponse = strictObj({
  ok: z.literal(true),
  user: AuthUserSchema,
}).openapi("MeResponse");

export const RefreshSchema = strictObj({}).openapi("RefreshRequest");

export const RefreshResponse = strictObj({
  ok: z.literal(true),
  xsrfToken: z.string(),
}).openapi("RefreshResponse");

export type SignupRequestT = z.infer<typeof SignupSchema>;
export type LoginRequestT = z.infer<typeof LoginSchema>;
export type AuthUserT = z.infer<typeof AuthUserSchema>;
export type AuthOkResponseT = z.infer<typeof AuthOkResponse>;
export type MeResponseT = z.infer<typeof MeResponse>;
export type RefreshRequestT = z.infer<typeof RefreshSchema>;
export type RefreshResponseT = z.infer<typeof RefreshResponse>;
