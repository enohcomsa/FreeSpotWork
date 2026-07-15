import {
  TIMETABLE_ACTIVITY_ROLLOVER_JOB_ID,
  type TimetableActivityRolloverJobDbDoc,
} from "../db/types";
import { timetableActivityRolloverJobToModel } from "../mappers";
import type { TimetableActivityRolloverJobT } from "../schemas/timetable-activity-rollover-job.zod";
import { getCollection } from "../utils/mongo";

const TIMETABLE_ACTIVITY_ROLLOVER_JOBS_COLLECTION = "timetable_activity_rollover_jobs";

export async function getTimetableActivityRolloverJob(): Promise<TimetableActivityRolloverJobT | null> {
  const collection = await getCollection<TimetableActivityRolloverJobDbDoc>(TIMETABLE_ACTIVITY_ROLLOVER_JOBS_COLLECTION);
  const doc = await collection.findOne({ _id: TIMETABLE_ACTIVITY_ROLLOVER_JOB_ID });
  return doc ? timetableActivityRolloverJobToModel(doc) : null;
}

export async function markTimetableActivityRolloverJobRunning(now: Date): Promise<void> {
  const collection = await getCollection<TimetableActivityRolloverJobDbDoc>(TIMETABLE_ACTIVITY_ROLLOVER_JOBS_COLLECTION);

  await collection.updateOne(
    { _id: TIMETABLE_ACTIVITY_ROLLOVER_JOB_ID },
    {
      $set: {
        status: "RUNNING",
        updatedAt: now,
      },
    },
  );
}

export async function markTimetableActivityRolloverJobSuccess(lastProcessedRolloverAt: Date, now: Date): Promise<void> {
  const collection = await getCollection<TimetableActivityRolloverJobDbDoc>(TIMETABLE_ACTIVITY_ROLLOVER_JOBS_COLLECTION);

  await collection.updateOne(
    { _id: TIMETABLE_ACTIVITY_ROLLOVER_JOB_ID },
    {
      $set: {
        lastSuccessfulRunAt: now,
        lastProcessedRolloverAt,
        status: "IDLE",
        updatedAt: now,
      },
    },
  );
}

export async function markTimetableActivityRolloverJobFailed(now: Date): Promise<void> {
  const collection = await getCollection<TimetableActivityRolloverJobDbDoc>(TIMETABLE_ACTIVITY_ROLLOVER_JOBS_COLLECTION);

  await collection.updateOne(
    { _id: TIMETABLE_ACTIVITY_ROLLOVER_JOB_ID },
    {
      $set: {
        status: "FAILED",
        updatedAt: now,
      },
    },
  );
}
