import { z } from "zod";
import { ObjectIdStr, SubjectIdArray } from "./common.zod";


export const RoomIdParam = z.object({
  id: ObjectIdStr,
});

export const RoomCreate = z.object({
  buildingId: ObjectIdStr,
  floorId: ObjectIdStr,
  name: z.string().min(1),
  totalSpotsNumber: z.number().int().min(0),
  unavailableSpots: z.number().int().min(0),
  subjectList: SubjectIdArray.default([]),
});

export const RoomUpdate = z.object({
  floorId: ObjectIdStr.optional(),
  name: z.string().min(1).optional(),
  totalSpotsNumber: z.number().int().min(0).optional(),
  unavailableSpots: z.number().int().min(0).optional(),
  subjectList: SubjectIdArray.optional(),
})
  .refine(v => Object.keys(v).length > 0, {
    message: "Provide at least one field to update",
  });

export const RoomResponse = z.object({
  id: ObjectIdStr,
  buildingId: ObjectIdStr,
  floorId: ObjectIdStr,
  name: z.string(),
  totalSpotsNumber: z.number().int().min(0),
  unavailableSpots: z.number().int().min(0),
  subjectList: z.array(ObjectIdStr),
});

export type RoomCreateInput = z.infer<typeof RoomCreate>;
export type RoomUpdateInput = z.infer<typeof RoomUpdate>;
export type RoomIdParamInput = z.infer<typeof RoomIdParam>;
export type RoomResponseDto = z.infer<typeof RoomResponse>;
