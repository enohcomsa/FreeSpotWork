import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

import { ObjectIdStr } from "./common.zod";

export const ProgramYearIdParam = z.object({ id: ObjectIdStr }).openapi("ProgramYearIdParam");

export const ProgramYearCreate = z.object({
  programId: ObjectIdStr,
  yearNumber: z.number().int().min(1).max(10),
  label: z.string().min(1),
}).openapi("ProgramYearCreate");

export const ProgramYearUpdate = z.object({
  yearNumber: z.number().int().min(1).max(10).optional(),
  label: z.string().min(1).optional(),
}).refine(v => Object.keys(v).length > 0, { message: "Provide at least one field to update" }).openapi("ProgramYearUpdate");

export const ProgramYearResponse = z.object({
  id: ObjectIdStr,
  programId: ObjectIdStr,
  yearNumber: z.number().int().min(1).max(10),
  label: z.string(),
}).openapi("ProgramYearResponse");

export type ProgramYearCreateInput = z.infer<typeof ProgramYearCreate>;
export type ProgramYearUpdateInput = z.infer<typeof ProgramYearUpdate>;
export type ProgramYearIdParamInput = z.infer<typeof ProgramYearIdParam>;
export type ProgramYearResponseDto = z.infer<typeof ProgramYearResponse>;
