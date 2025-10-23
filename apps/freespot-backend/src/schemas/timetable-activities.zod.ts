import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ActivityType, CohortIdArray, ObjectIdStr, WeekDay, WeekParity } from "./common.zod";
import { strictObj, nonEmptyPatch } from "../utils/zod-helpers";

extendZodWithOpenApi(z);

const TimetableActivityBaseRaw = strictObj({
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
});

export const TimetableActivityBase = TimetableActivityBaseRaw.openapi("TimetableActivityBase");
export const TimetableActivityCreate = TimetableActivityBaseRaw.refine((d) =>
  (d.activityType === "SPECIAL_EVENT" && d.cohortIds.length >= 0) ||
  (["LABORATORY", "COURSE", "PROJECT", "SEMINAR"].includes(d.activityType) && d.cohortIds.length >= 1),
  { message: "Invalid cohortIds for activityType" }).openapi("TimetableActivityCreate");
export const TimetableActivityIdParam = z.object({ id: ObjectIdStr }).openapi("TimetableActivityIdParam");
export const TimetableActivityUpdate = nonEmptyPatch(TimetableActivityBaseRaw.partial()).openapi("TimetableActivityUpdate");
export const TimetableActivityResponse = TimetableActivityBaseRaw.extend({ id: ObjectIdStr }).openapi("TimetableActivityResponse");
export const TimetableActivityList = z.array(TimetableActivityResponse).openapi("TimetableActivityList");

export type TimetableActivityBaseT = z.infer<typeof TimetableActivityBase>;
export type TimetableActivityCreateRequest = z.infer<typeof TimetableActivityCreate>;
export type TimetableActivityUpdateRequest = z.infer<typeof TimetableActivityUpdate>;
export type TimetableActivityIdParamT = z.infer<typeof TimetableActivityIdParam>;
export type TimetableActivityResponseDto = z.infer<typeof TimetableActivityResponse>;
