import { z } from "zod";
import { RolloverJobStatus } from "./common.zod";
import { TIMETABLE_ACTIVITY_ROLLOVER_JOB_ID } from "../db/types";

export const TimetableActivityRolloverJob = z.object({
  id: z.literal(TIMETABLE_ACTIVITY_ROLLOVER_JOB_ID),
  lastSuccessfulRunAt: z.date().nullable(),
  lastProcessedRolloverAt: z.date().nullable(),
  status: RolloverJobStatus,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TimetableActivityRolloverJobT = z.infer<typeof TimetableActivityRolloverJob>;
