import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ObjectIdStr } from "./common.zod";
import { strictObj, nonEmptyPatch } from "../utils/zod-helpers";

extendZodWithOpenApi(z);

export const FacultyBase = strictObj({
  name: z.string().trim().min(1),
  shortName: z.string().trim().min(1),
}).openapi("FacultyBase");

export const FacultyIdParam = z.object({ id: ObjectIdStr }).openapi("FacultyIdParam");
export const FacultyCreate = FacultyBase.openapi("FacultyCreate");
export const FacultyUpdate = nonEmptyPatch(FacultyBase.partial()).openapi("FacultyUpdate");
export const FacultyResponse = FacultyBase.extend({ id: ObjectIdStr }).openapi("FacultyResponse");
export const FacultyList = z.array(FacultyResponse).openapi("FacultyList");

export type FacultyBaseT = z.infer<typeof FacultyBase>;
export type FacultyCreateRequest = z.infer<typeof FacultyCreate>;
export type FacultyUpdateRequest = z.infer<typeof FacultyUpdate>;
export type FacultyIdParamT = z.infer<typeof FacultyIdParam>;
export type FacultyResponseDto = z.infer<typeof FacultyResponse>;
