import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

import { ObjectIdStr } from "./common.zod";

export const SubjectIdParam = z.object({ id: ObjectIdStr }).openapi("SubjectIdParam");

export const SubjectCreate = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
}).openapi("SubjectCreate");

export const SubjectUpdate = z.object({
  name: z.string().min(1).optional(),
  shortName: z.string().min(1).optional(),
}).refine(v => Object.keys(v).length > 0, { message: "Provide at least one field to update" }).openapi("SubjectUpdate");

export const SubjectResponse = z.object({
  id: ObjectIdStr,
  name: z.string(),
  shortName: z.string(),
}).openapi("SubjectResponse");

export type SubjectCreateInput = z.infer<typeof SubjectCreate>;
export type SubjectUpdateInput = z.infer<typeof SubjectUpdate>;
export type SubjectIdParamInput = z.infer<typeof SubjectIdParam>;
export type SubjectResponseDto = z.infer<typeof SubjectResponse>;
