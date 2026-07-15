export const TIMETABLE_ACTIVITY_ROLLOVER_JOB_ID =
  "timetable-activity-rollover" as const;

export const TIMETABLE_ACTIVITY_ROLLOVER_JOB_STATUSES = [
  "IDLE",
  "RUNNING",
  "FAILED",
] as const;

export type TimetableActivityRolloverJobStatusT =
  (typeof TIMETABLE_ACTIVITY_ROLLOVER_JOB_STATUSES)[number];

export type TimetableActivityRolloverJobDbDoc = {
  _id: typeof TIMETABLE_ACTIVITY_ROLLOVER_JOB_ID;
  lastSuccessfulRunAt: Date | null;
  lastProcessedRolloverAt: Date | null;
  status: TimetableActivityRolloverJobStatusT;
  createdAt: Date;
  updatedAt: Date;
};
