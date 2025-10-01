import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

import { Degree, ObjectIdStr } from "./common.zod";

export const ProgramIdParam = z.object({ id: ObjectIdStr }).openapi("ProgramIdParam");

export const ProgramCreate = z.object({
  facultyId: ObjectIdStr,
  name: z.string().min(1),
  degree: Degree,
  active: z.boolean(),
}).openapi("ProgramCreate");

export const ProgramUpdate = z.object({
  name: z.string().min(1).optional(),
  degree: Degree.optional(),
  active: z.boolean().optional(),
}).refine(v => Object.keys(v).length > 0, { message: "Provide at least one field to update" }).openapi("ProgramUpdate");

export const ProgramResponse = z.object({
  id: ObjectIdStr,
  facultyId: ObjectIdStr,
  name: z.string(),
  degree: Degree,
  active: z.boolean(),
}).openapi("ProgramResponse");

export type ProgramCreateInput = z.infer<typeof ProgramCreate>;
export type ProgramUpdateInput = z.infer<typeof ProgramUpdate>;
export type ProgramIdParamInput = z.infer<typeof ProgramIdParam>;
export type ProgramResponseDto = z.infer<typeof ProgramResponse>;
