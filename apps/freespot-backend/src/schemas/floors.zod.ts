import { z } from "zod";
import { ObjectIdStr } from "./common.zod";

export const FloorIdParam = z.object({
  id: ObjectIdStr,
});

export const FloorCreate = z.object({
  buildingId: ObjectIdStr,
  name: z.string().min(1),
  totalSpotsNumber: z.number().int().min(0),
  unavailableSpots: z.number().int().min(0),
});

export const FloorUpdate = z
  .object({
    name: z.string().min(1).optional(),
    totalSpotsNumber: z.number().int().min(0).optional(),
    unavailableSpots: z.number().int().min(0).optional(),
  })
  .refine(v => Object.keys(v).length > 0, { message: "Provide at least one field to update" });

export const FloorResponse = z.object({
  id: ObjectIdStr,
  buildingId: ObjectIdStr,
  name: z.string(),
  totalSpotsNumber: z.number().int().min(0),
  unavailableSpots: z.number().int().min(0),
});

export type FloorCreateInput = z.infer<typeof FloorCreate>;
export type FloorUpdateInput = z.infer<typeof FloorUpdate>;
export type FloorIdParamInput = z.infer<typeof FloorIdParam>;
export type FloorResponseDto = z.infer<typeof FloorResponse>;
