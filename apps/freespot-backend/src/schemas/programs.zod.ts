import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { Degree, ObjectIdStr } from "./common.zod";
import { strictObj, nonEmptyPatch } from "../utils/zod-helpers";

extendZodWithOpenApi(z);

export const ProgramBase = strictObj({
  facultyId: ObjectIdStr,
  name: z.string().trim().min(1),
  degree: Degree,
  active: z.boolean(),
}).openapi("ProgramBase");

export const ProgramIdParam = z.object({ id: ObjectIdStr }).openapi("ProgramIdParam");
export const ProgramCreate = ProgramBase.openapi("ProgramCreate");
export const ProgramUpdate = nonEmptyPatch(ProgramBase.partial()).openapi("ProgramUpdate");
export const ProgramResponse = ProgramBase.extend({ id: ObjectIdStr }).openapi("ProgramResponse");
export const ProgramList = z.array(ProgramResponse).openapi("ProgramList");

export type ProgramBaseT = z.infer<typeof ProgramBase>;
export type ProgramCreateRequest = z.infer<typeof ProgramCreate>;
export type ProgramUpdateRequest = z.infer<typeof ProgramUpdate>;
export type ProgramIdParamT = z.infer<typeof ProgramIdParam>;
export type ProgramResponseDto = z.infer<typeof ProgramResponse>;
