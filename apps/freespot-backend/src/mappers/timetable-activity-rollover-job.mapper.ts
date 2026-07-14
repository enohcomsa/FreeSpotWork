import type { TimetableActivityRolloverJobDbDoc } from "../db/types";
import { TimetableActivityRolloverJob, type TimetableActivityRolloverJobT } from "../schemas/timetable-activity-rollover-job.zod";

export function timetableActivityRolloverJobToModel(
  doc: TimetableActivityRolloverJobDbDoc,
): TimetableActivityRolloverJobT {
  return TimetableActivityRolloverJob.parse({
    id: doc._id,
    lastSuccessfulRunAt: doc.lastSuccessfulRunAt,
    lastProcessedRolloverAt: doc.lastProcessedRolloverAt,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
}
