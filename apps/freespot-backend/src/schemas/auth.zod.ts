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

export const UserPublicSchema = strictObj({
  id: ObjectIdStr,
  email: z.string().email(),
  role: z.enum(["ADMIN", "MEMBER"]),
}).openapi("UserPublic");

export const AuthOkResponse = strictObj({
  ok: z.literal(true),
  user: UserPublicSchema,
}).openapi("AuthOkResponse");

export const MeResponse = AuthOkResponse.openapi("MeResponse");

export type SignupRequestT = z.infer<typeof SignupSchema>;
export type LoginRequestT = z.infer<typeof LoginSchema>;
export type RefreshRequestT = z.infer<typeof RefreshSchema>;
export type UserPublicT = z.infer<typeof UserPublicSchema>;
export type AuthOkResponseT = z.infer<typeof AuthOkResponse>;
export type MeResponseT = z.infer<typeof MeResponse>;
