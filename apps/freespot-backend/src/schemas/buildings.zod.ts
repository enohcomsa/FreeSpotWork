import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

import { ObjectIdStr } from "./common.zod";

export const BuildingIdParam = z.object({ id: ObjectIdStr }).openapi("BuildingIdParam");

export const BuildingCreate = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  specialEvent: z.boolean(),
}).openapi("BuildingCreate");

export const BuildingUpdate = z.object({
  name: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  specialEvent: z.boolean().optional(),
}).refine(v => Object.keys(v).length > 0, { message: "Provide at least one field to update" }).openapi("BuildingUpdate");

export const BuildingResponse = z.object({
  id: ObjectIdStr,
  name: z.string(),
  address: z.string(),
  specialEvent: z.boolean(),
}).openapi("BuildingResponse");

export type BuildingCreateInput = z.infer<typeof BuildingCreate>;
export type BuildingUpdateInput = z.infer<typeof BuildingUpdate>;
export type BuildingIdParamInput = z.infer<typeof BuildingIdParam>;
export type BuildingResponseDto = z.infer<typeof BuildingResponse>;
