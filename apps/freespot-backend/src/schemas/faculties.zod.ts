import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

import { ObjectIdStr } from "./common.zod";

export const FacultyIdParam = z.object({ id: ObjectIdStr }).openapi("FacultyIdParam");

export const FacultyCreate = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
}).openapi("FacultyCreate");

export const FacultyUpdate = z.object({
  name: z.string().min(1).optional(),
  shortName: z.string().min(1).optional(),
}).refine(v => Object.keys(v).length > 0, { message: "Provide at least one field to update" }).openapi("FacultyUpdate");

export const FacultyResponse = z.object({
  id: ObjectIdStr,
  name: z.string(),
  shortName: z.string(),
}).openapi("FacultyResponse");

export type FacultyCreateInput = z.infer<typeof FacultyCreate>;
export type FacultyUpdateInput = z.infer<typeof FacultyUpdate>;
export type FacultyIdParamInput = z.infer<typeof FacultyIdParam>;
export type FacultyResponseDto = z.infer<typeof FacultyResponse>;
