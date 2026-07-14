import { CollectionSpec } from "../migrate/helpers";
import { TIMETABLE_ACTIVITY_ROLLOVER_JOB_STATUSES } from "../types/timetable-activity-rollover-job.db";

export const timetableActivityRolloverJobSpec: CollectionSpec = {
  name: "timetable_activity_rollover_jobs",
  validator: {
    bsonType: "object",
    required: [
      "_id",
      "lastSuccessfulRunAt",
      "lastProcessedRolloverAt",
      "status",
      "createdAt",
      "updatedAt",
    ],
    properties: {
      _id: {
        bsonType: "string",
      },
      lastSuccessfulRunAt: {
        bsonType: ["date", "null"],
      },
      lastProcessedRolloverAt: {
        bsonType: ["date", "null"],
      },
      status: {
        enum: [...TIMETABLE_ACTIVITY_ROLLOVER_JOB_STATUSES],
      },
      createdAt: {
        bsonType: "date",
      },
      updatedAt: {
        bsonType: "date",
      },
    },
    additionalProperties: false,
  }
};
