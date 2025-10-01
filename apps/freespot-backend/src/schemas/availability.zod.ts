import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

import { ObjectIdStr } from "./common.zod";

export const AvailabilityQuery = z.object({
  date: z.string(),
  roomId: ObjectIdStr.optional(),
  cohortId: ObjectIdStr.optional(),
  subjectId: ObjectIdStr.optional(),
  startHour: z.number().int().min(0).max(23).optional(),
  endHour: z.number().int().min(1).max(24).optional(),
  minFreeSpots: z.number().int().min(0).default(1),
  limit: z.number().int().min(1).max(200).default(100),
}).refine(q => !q.startHour || !q.endHour || q.startHour < q.endHour, { message: "startHour must be < endHour" }).openapi("AvailabilityQuery");

export const AvailabilitySlot = z.object({
  date: z.string(),
  roomId: ObjectIdStr,
  startHour: z.number().int().min(0).max(23),
  endHour: z.number().int().min(1).max(24),
  capacity: z.number().int().min(0),
  reservedSpots: z.number().int().min(0),
  busySpots: z.number().int().min(0),
  freeSpots: z.number().int().min(0),
  subjectId: ObjectIdStr.optional(),
  activityId: ObjectIdStr.optional(),
  cohortIds: z.array(ObjectIdStr).optional(),
}).openapi("AvailabilitySlot");

export const AvailabilityResponse = z.object({
  items: z.array(AvailabilitySlot),
  total: z.number().int().min(0),
}).openapi("AvailabilityResponse");

export type AvailabilityQueryInput = z.infer<typeof AvailabilityQuery>;
export type AvailabilitySlotDto = z.infer<typeof AvailabilitySlot>;
export type AvailabilityResponseDto = z.infer<typeof AvailabilityResponse>;
