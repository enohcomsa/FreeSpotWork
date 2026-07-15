import {
  getTimetableActivityRolloverJob,
  markTimetableActivityRolloverJobFailed,
  markTimetableActivityRolloverJobRunning,
  markTimetableActivityRolloverJobSuccess,
} from "../../repos/timetable-activity-rollover-job.repo";
import { executeTimetableActivityRollover } from "./timetable-activity-rollover.service";
import {
  getLatestDueRolloverAt,
} from "./timetable-activity-rollover-policy.service";
import { timetableActivityRolloverConfig } from "./timetable-activity-rollover.config";

export async function runDueTimetableActivityRollover(now = new Date()): Promise<void> {
  const job = await getTimetableActivityRolloverJob();

  if (!job) {
    throw new Error("Missing timetable activity rollover job state");
  }

  const latestDueRolloverAt = getLatestDueRolloverAt(now, timetableActivityRolloverConfig);

  if (!latestDueRolloverAt) {
    return;
  }

  if (job.lastProcessedRolloverAt && job.lastProcessedRolloverAt >= latestDueRolloverAt) {
    return;
  }

  await markTimetableActivityRolloverJobRunning(now);

  try {
    await executeTimetableActivityRollover(latestDueRolloverAt);

    await markTimetableActivityRolloverJobSuccess(
      latestDueRolloverAt,
      new Date(),
    );
  } catch (error) {
    await markTimetableActivityRolloverJobFailed(new Date());
    throw error;
  }
}
