import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ObjectIdStr } from "./common.zod";
import { strictObj } from "../utils/zod-helpers";

extendZodWithOpenApi(z);

export const AuthIdentifier = z.string().trim().min(3).openapi("AuthIdentifier");

export const Password = z.string().min(8).max(200).openapi("Password");

export const SignupSchema = strictObj({
  email: z.string().email().min(3),
  password: Password,
  username: z.string().trim().min(3).max(50).optional(),
}).openapi("SignupRequest");

export const LoginSchema = strictObj({
  identifier: AuthIdentifier,
  password: Password,
}).openapi("LoginRequest");

export const RefreshSchema = strictObj({}).openapi("RefreshRequest");

export const RefreshResponse = strictObj({
  ok: z.literal(true),
  xsrfToken: z.string(),
}).openapi("RefreshResponse");

export const AuthUserSchema = strictObj({
  id: ObjectIdStr,
  email: z.string().email(),
  role: z.enum(["ADMIN", "MEMBER"]),
  firstName: z.string().nullable(),
  familyName: z.string().nullable(),
  preferredLanguage: z.enum(["en", "ro"]).nullable().optional(),
  preferredTheme: z.enum(["DARK", "LIGHT"]).nullable().optional(),
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

export type SignupRequestT = z.infer<typeof SignupSchema>;
export type LoginRequestT = z.infer<typeof LoginSchema>;
export type RefreshRequestT = z.infer<typeof RefreshSchema>;
export type AuthUserT = z.infer<typeof AuthUserSchema>;
export type AuthOkResponseT = z.infer<typeof AuthOkResponse>;
export type MeResponseT = z.infer<typeof MeResponse>;
export type RefreshResponseT = z.infer<typeof RefreshResponse>;
