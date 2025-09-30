import { CollectionSpec } from "../migrate/helpers";

export const bookingsSpec: CollectionSpec = {
  name: "bookings",
  validator: {
    bsonType: "object",
    required: ["_id", "activityId", "userId", "status", "createdAt"],
    properties: {
      _id: { bsonType: "objectId" },
      activityId: { bsonType: "objectId" },
      userId: { bsonType: "objectId" },
      cohortId: { bsonType: ["objectId", "null"] },
      status: { enum: ["CONFIRMED", "WAITLISTED", "CANCELLED"] },
      createdAt: { bsonType: "date" },
      updatedAt: { bsonType: ["date", "null"] },
      source: {
        bsonType: ["object", "null"],
        required: ["type", "id"],
        properties: {
          type: { enum: ["ROOM_TIMETABLE", "COHORT_TIMETABLE", "EVENT"] },
          id: { bsonType: "objectId" }
        },
        additionalProperties: false
      },
    },
    additionalProperties: false
  },
  indexes: [
    { key: { userId: 1, activityId: 1 }, name: "uniq_user_activity", unique: true },
    { key: { activityId: 1 }, name: "by_activity" },
    { key: { userId: 1, createdAt: 1 }, name: "by_user_createdAt" },
    { key: { cohortId: 1 }, name: "by_cohort" }
  ]
};
