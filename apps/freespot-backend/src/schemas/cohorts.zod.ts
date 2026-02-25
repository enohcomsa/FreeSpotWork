import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { CohortType, ObjectIdStr } from "./common.zod";
import { strictObj, nonEmptyDefinedPatch } from "../utils/zod-helpers";

extendZodWithOpenApi(z);

export const CohortBase = strictObj({
  type: CohortType,
  programYearId: ObjectIdStr,
  name: z.string().trim().min(1),
  parentGroupId: ObjectIdStr.nullable().optional(),
}).openapi("CohortBase");

export const CohortIdParam = z.object({ id: ObjectIdStr }).openapi("CohortIdParam");
export const CohortCreate = CohortBase.openapi("CohortCreate");
export const CohortUpdate = nonEmptyDefinedPatch(CohortBase.partial()).openapi("CohortUpdate");
export const CohortResponse = CohortBase.extend({ id: ObjectIdStr }).openapi("CohortResponse");
export const CohortList = z.array(CohortResponse).openapi("CohortList");

export type CohortBaseT = z.infer<typeof CohortBase>;
export type CohortCreateRequest = z.infer<typeof CohortCreate>;
export type CohortUpdateRequest = z.infer<typeof CohortUpdate>;
export type CohortIdParamT = z.infer<typeof CohortIdParam>;
export type CohortResponseDto = z.infer<typeof CohortResponse>;
