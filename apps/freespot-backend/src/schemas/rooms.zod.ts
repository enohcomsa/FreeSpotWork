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
}).openapi("RoomBase");

export const RoomIdParam = z.object({ id: ObjectIdStr }).openapi("RoomIdParam");
export const RoomCreate = RoomBase.openapi("RoomCreate");
export const RoomUpdate = nonEmptyDefinedPatch(RoomBase.partial()).openapi("RoomUpdate");
export const RoomResponse = RoomBase.extend({ id: ObjectIdStr }).openapi("RoomResponse");
export const RoomList = z.array(RoomResponse).openapi("RoomList");

export type RoomBaseT = z.infer<typeof RoomBase>;
export type RoomCreateRequest = z.infer<typeof RoomCreate>;
export type RoomUpdateRequest = z.infer<typeof RoomUpdate>;
export type RoomIdParamT = z.infer<typeof RoomIdParam>;
export type RoomResponseDto = z.infer<typeof RoomResponse>;
