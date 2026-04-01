import { ACTIVITY_TYPES, BOOKING_STATUSES } from "../../schemas/common.constants";
import { CollectionSpec } from "../migrate/helpers";

export const bookingsSpec: CollectionSpec = {
  name: "bookings",
  validator: {
    bsonType: "object",
    required: [
      "_id",
      "activityId",
      "userId",
      "activityType",
      "status",
      "createdAt",
    ],
    properties: {
      _id: { bsonType: "objectId" },

      activityId: { bsonType: "objectId" },
      userId: { bsonType: "objectId" },

      facultyId: { oneOf: [{ bsonType: "objectId" }, { bsonType: "null" }] },
      programId: { oneOf: [{ bsonType: "objectId" }, { bsonType: "null" }] },
      programYearId: { oneOf: [{ bsonType: "objectId" }, { bsonType: "null" }] },
      groupCohortId: { oneOf: [{ bsonType: "objectId" }, { bsonType: "null" }] },
      semigroupCohortId: { oneOf: [{ bsonType: "objectId" }, { bsonType: "null" }] },

      subjectId: { oneOf: [{ bsonType: "objectId" }, { bsonType: "null" }] },

      activityType: {
        enum: [...ACTIVITY_TYPES],
      },

      status: {
        enum: [...BOOKING_STATUSES],
      },

      originalActivityId: { oneOf: [{ bsonType: "objectId" }, { bsonType: "null" }] },
      isRescheduled: { oneOf: [{ bsonType: "bool" }, { bsonType: "null" }] },
      rescheduledAt: { oneOf: [{ bsonType: "date" }, { bsonType: "null" }] },

      createdAt: { bsonType: "date" },
      updatedAt: { oneOf: [{ bsonType: "date" }, { bsonType: "null" }] },
    },
    additionalProperties: false,
  },

  indexes: [
    { key: { userId: 1, activityId: 1 }, name: "uniq_user_activity", unique: true },
    { key: { activityId: 1 }, name: "by_activity" },
    { key: { userId: 1, createdAt: 1 }, name: "by_user_createdAt" },
    { key: { userId: 1, status: 1 }, name: "by_user_status" },
    { key: { programYearId: 1, activityType: 1 }, name: "by_programYear_activityType" },
    { key: { subjectId: 1, activityType: 1 }, name: "by_subject_activityType" },
    { key: { originalActivityId: 1 }, name: "by_originalActivityId" },
  ],
};
