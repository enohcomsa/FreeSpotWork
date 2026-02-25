
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ObjectIdStr } from "./common.zod";
import { strictObj, nonEmptyDefinedPatch } from "../utils/zod-helpers";

extendZodWithOpenApi(z);

export const ProgramYearBase = strictObj({
  programId: ObjectIdStr,
  yearNumber: z.number().int().min(1).max(10),
  label: z.string().trim().min(1),
}).openapi("ProgramYearBase");

export const ProgramYearIdParam = z.object({ id: ObjectIdStr }).openapi("ProgramYearIdParam");
export const ProgramYearCreate = ProgramYearBase.openapi("ProgramYearCreate");
export const ProgramYearUpdate = nonEmptyDefinedPatch(ProgramYearBase.partial()).openapi("ProgramYearUpdate");
export const ProgramYearResponse = ProgramYearBase.extend({ id: ObjectIdStr }).openapi("ProgramYearResponse");
export const ProgramYearList = z.array(ProgramYearResponse).openapi("ProgramYearList");

export type ProgramYearBaseT = z.infer<typeof ProgramYearBase>;
export type ProgramYearCreateRequest = z.infer<typeof ProgramYearCreate>;
export type ProgramYearUpdateRequest = z.infer<typeof ProgramYearUpdate>;
export type ProgramYearIdParamT = z.infer<typeof ProgramYearIdParam>;
export type ProgramYearResponseDto = z.infer<typeof ProgramYearResponse>;
