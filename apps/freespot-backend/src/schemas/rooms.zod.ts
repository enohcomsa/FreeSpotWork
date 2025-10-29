import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ObjectIdStr, SubjectIdArray } from "./common.zod";
import { strictObj, nonEmptyDefinedPatch } from "../utils/zod-helpers";

extendZodWithOpenApi(z);

export const RoomBase = strictObj({
  buildingId: ObjectIdStr,
  floorId: ObjectIdStr,
  name: z.string().trim().min(1),
  totalSpotsNumber: z.number().int().min(0),
  unavailableSpots: z.number().int().min(0),
  subjectList: SubjectIdArray.default([]),
});

export const RoomIdParam = z.object({ id: ObjectIdStr }).openapi("RoomIdParam");
export const RoomCreate = RoomBase;
export const RoomUpdate = nonEmptyDefinedPatch(RoomBase.partial());
export const RoomResponse = RoomBase.extend({ id: ObjectIdStr });
export const RoomList = z.array(RoomResponse);

export const RoomBase_OA = strictObj({
  buildingId: ObjectIdStr,
  floorId: ObjectIdStr,
  name: z.string().trim().min(1),
  totalSpotsNumber: z.number().int().min(0),
  unavailableSpots: z.number().int().min(0),
  subjectList: z.array(ObjectIdStr),
}).openapi("RoomBase");

export const RoomCreate_OA = RoomBase_OA.openapi("RoomCreate");
export const RoomUpdate_OA = nonEmptyDefinedPatch(RoomBase_OA.partial()).openapi("RoomUpdate");
export const RoomResponse_OA = RoomBase_OA.extend({ id: ObjectIdStr }).openapi("RoomResponse");

export type RoomBaseT = z.infer<typeof RoomBase>;
export type RoomCreateRequest = z.infer<typeof RoomCreate>;
export type RoomUpdateRequest = z.infer<typeof RoomUpdate>;
export type RoomIdParamT = z.infer<typeof RoomIdParam>;
export type RoomResponseDto = z.infer<typeof RoomResponse>;
