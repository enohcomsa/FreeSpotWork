import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ObjectIdStr, ISODateStr } from "./common.zod";
import { strictObj } from "../utils/zod-helpers";

extendZodWithOpenApi(z);

export const RefreshTokenBase = strictObj({
  userId: ObjectIdStr,
  jti: z.string().min(10),
  tokenHash: z.string().min(20),
  createdAt: ISODateStr,
  expiresAt: ISODateStr,
  revokedAt: ISODateStr.nullable().optional(),
  ip: z.string().min(3).max(80).nullable().optional(),
  userAgent: z.string().min(3).max(512).nullable().optional(),
}).openapi("RefreshTokenBase");

export type RefreshTokenBaseT = z.infer<typeof RefreshTokenBase>;
