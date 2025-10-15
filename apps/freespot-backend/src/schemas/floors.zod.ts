import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

import { ObjectIdStr } from "./common.zod";
import { strictObj, nonEmptyPatch } from "../utils/zod-helpers";


const FloorBase = strictObj({
  buildingId: ObjectIdStr,
  name: z.string().min(1),
  totalSpotsNumber: z.number().int().min(0),
  unavailableSpots: z.number().int().min(0),
}).openapi("FloorCreate");

export const FloorIdParam = z.object({ id: ObjectIdStr }).openapi("FloorIdParam");
export const FloorCreate = FloorBase.openapi("FloorCreate");
export const FloorUpdate = nonEmptyPatch(FloorBase.partial()).openapi("FloorUpdate");
export const FloorResponse = FloorBase.extend({ id: ObjectIdStr }).openapi("FloorResponse");
export const FloorList=z.array(FloorResponse).openapi('FloorList');

export type FloorBaseT=z.infer<typeof FloorBase>;
export type FloorCreateRequest = z.infer<typeof FloorCreate>;
export type FloorUpdateRequest = z.infer<typeof FloorUpdate>;
export type FloorIdParam = z.infer<typeof FloorIdParam>;
export type FloorResponseDto = z.infer<typeof FloorResponse>;
