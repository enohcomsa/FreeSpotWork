import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ObjectIdStr, ActivityType, ISODateStr } from "./common.zod";

extendZodWithOpenApi(z);

export const RescheduleOptionsQuery = z.object({
  bookingId: ObjectIdStr,
}).openapi("RescheduleOptionsQuery");

export const RescheduleOption = z.object({
  activityId: ObjectIdStr,
  subjectId: ObjectIdStr,
  activityType: ActivityType,
  date: z.string(),
  weekDay: z.string(),
  startHour: z.number().int().min(0).max(23),
  endHour: z.number().int().min(1).max(24),
  capacity: z.number().int().min(0),
  reservedSpots: z.number().int().min(0),
  busySpots: z.number().int().min(0),
  freeSpots: z.number().int().min(0),
  cohortIds: z.array(ObjectIdStr),
}).openapi("RescheduleOption");

export const RescheduleOptionsResponse = z.object({
  currentBooking: z.object({
    id: ObjectIdStr,
    activityId: ObjectIdStr,
    subjectId: ObjectIdStr.nullable(),
    activityType: ActivityType,
    programYearId: ObjectIdStr.nullable(),
    groupCohortId: ObjectIdStr.nullable(),
    semigroupCohortId: ObjectIdStr.nullable(),
    originalActivityId: ObjectIdStr.nullable().optional(),
    isRescheduled: z.boolean().nullable().optional(),
    rescheduledAt: ISODateStr.nullable().optional(),
  }),
  items: z.array(RescheduleOption),
  total: z.number().int().min(0),
}).openapi("RescheduleOptionsResponse");

export type RescheduleOptionsQueryInput = z.infer<typeof RescheduleOptionsQuery>;
export type RescheduleOptionDto = z.infer<typeof RescheduleOption>;
export type RescheduleOptionsResponseDto = z.infer<typeof RescheduleOptionsResponse>;
