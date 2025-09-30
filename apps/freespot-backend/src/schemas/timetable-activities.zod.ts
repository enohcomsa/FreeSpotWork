import { z } from "zod";
import { ActivityType, CohortIdArray, ObjectIdStr, WeekDay, WeekParity } from "./common.zod";

export const TimetableActivityIdParam = z.object({
  id: ObjectIdStr,
});

export const TimetableActivityCreate = z.object({
  roomId: ObjectIdStr,
  subjectId: ObjectIdStr,
  date: z.string(),
  weekDay: WeekDay,
  activityType: ActivityType,
  cohortIds: CohortIdArray,
  startHour: z.number().int().min(0).max(23),
  endHour: z.number().int().min(1).max(24),
  weekParity: WeekParity,
  capacity: z.number().int().min(0),
  reservedSpots: z.number().int().min(0),
  busySpots: z.number().int().min(0),
  freeSpots: z.number().int().min(0),
})
  .refine(
    (data) =>
      (data.activityType === "SPECIAL_EVENT" && data.cohortIds.length >= 0) ||
      (["LABORATORY", "COURSE", "PROJECT", "SEMINAR"].includes(data.activityType) &&
        data.cohortIds.length >= 1),
    { message: "Invalid cohortIds for activityType" }
  );

export const TimetableActivityUpdate = z.object({
  roomId: ObjectIdStr.optional(),
  subjectId: ObjectIdStr.optional(),
  date: z.string().optional(),
  weekDay: WeekDay.optional(),
  activityType: ActivityType.optional(),
  cohortIds: CohortIdArray.optional(),
  startHour: z.number().int().min(0).max(23).optional(),
  endHour: z.number().int().min(1).max(24).optional(),
  weekParity: WeekParity.optional(),
  capacity: z.number().int().min(0).optional(),
  reservedSpots: z.number().int().min(0).optional(),
  busySpots: z.number().int().min(0).optional(),
  freeSpots: z.number().int().min(0).optional(),
})
  .refine(v => Object.keys(v).length > 0, {
    message: "Provide at least one field to update",
  });

export const TimetableActivityResponse = z.object({
  id: ObjectIdStr,
  roomId: ObjectIdStr,
  subjectId: ObjectIdStr,
  date: z.string(),
  weekDay: WeekDay,
  activityType: ActivityType,
  cohortIds: z.array(ObjectIdStr),
  startHour: z.number().int().min(0).max(23),
  endHour: z.number().int().min(1).max(24),
  weekParity: WeekParity,
  capacity: z.number().int().min(0),
  reservedSpots: z.number().int().min(0),
  busySpots: z.number().int().min(0),
  freeSpots: z.number().int().min(0),
});

export type TimetableActivityCreateInput = z.infer<typeof TimetableActivityCreate>;
export type TimetableActivityUpdateInput = z.infer<typeof TimetableActivityUpdate>;
export type TimetableActivityIdParamInput = z.infer<typeof TimetableActivityIdParam>;
export type TimetableActivityResponseDto = z.infer<typeof TimetableActivityResponse>;
