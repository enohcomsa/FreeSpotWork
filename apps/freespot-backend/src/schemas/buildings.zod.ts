import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ObjectIdStr } from "./common.zod";
import { strictObj, nonEmptyPatch } from "../utils/zod-helpers";

extendZodWithOpenApi(z);

const BuildingBase = strictObj({
  name: z.string().trim().min(1),
  address: z.string().trim().min(1),
  specialEvent: z.boolean(),
}).openapi("BuildingBase");

export const BuildingIdParam = strictObj({ id: ObjectIdStr }).openapi("BuildingIdParam");
export const BuildingCreate = BuildingBase.openapi("BuildingCreate");
export const BuildingUpdate = nonEmptyPatch(BuildingBase.partial()).openapi("BuildingUpdate");
export const BuildingResponse = BuildingBase.extend({ id: ObjectIdStr, }).openapi("BuildingResponse");
export const BuildingList = z.array(BuildingResponse).openapi("BuildingList");

export type BuildingBaseT = z.infer<typeof BuildingBase>;
export type BuildingCreateRequest = z.infer<typeof BuildingCreate>;
export type BuildingUpdateRequest = z.infer<typeof BuildingUpdate>;
export type BuildingIdParam = z.infer<typeof BuildingIdParam>;
export type BuildingResponseDto = z.infer<typeof BuildingResponse>;
