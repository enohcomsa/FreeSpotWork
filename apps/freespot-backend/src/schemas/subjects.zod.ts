import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ObjectIdStr } from "./common.zod";
import { strictObj, nonEmptyDefinedPatch } from "../utils/zod-helpers";

extendZodWithOpenApi(z);

export const SubjectBase = strictObj({
  name: z.string().trim().min(1),
  shortName: z.string().trim().min(1),
}).openapi("SubjectBase");

export const SubjectIdParam = z.object({ id: ObjectIdStr }).openapi("SubjectIdParam");
export const SubjectCreate = SubjectBase.openapi("SubjectCreate");
export const SubjectUpdate = nonEmptyDefinedPatch(SubjectBase.partial()).openapi("SubjectUpdate");
export const SubjectResponse = SubjectBase.extend({ id: ObjectIdStr }).openapi("SubjectResponse");
export const SubjectList = z.array(SubjectResponse).openapi("SubjectList");

export type SubjectBaseT = z.infer<typeof SubjectBase>;
export type SubjectCreateRequest = z.infer<typeof SubjectCreate>;
export type SubjectUpdateRequest = z.infer<typeof SubjectUpdate>;
export type SubjectIdParamT = z.infer<typeof SubjectIdParam>;
export type SubjectResponseDto = z.infer<typeof SubjectResponse>;
