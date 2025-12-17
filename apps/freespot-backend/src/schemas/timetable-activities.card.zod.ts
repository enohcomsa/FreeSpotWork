import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ActivityType, ObjectIdStr, WeekDay, WeekParity } from "./common.zod";
import { strictObj } from "../utils/zod-helpers";

extendZodWithOpenApi(z);

export const TimetableActivityCard = strictObj({
  id: ObjectIdStr,
  weekDay: WeekDay,
  startHour: z.number().int().min(0).max(23),
  endHour: z.number().int().min(1).max(24),
  weekParity: WeekParity,
  activityType: ActivityType,
  roomName: z.string(),
  subjectItemShortName: z.string(),
}).openapi("TimetableActivityCard");
export const TimetableActivityCardIdParam = strictObj({ id: ObjectIdStr }).openapi("TimetableActivityCardIdParam");

export type TimetableActivityCardDto = z.infer<typeof TimetableActivityCard>;
export type TimetableActivityCardIdParamT = z.infer<typeof TimetableActivityCardIdParam>;
