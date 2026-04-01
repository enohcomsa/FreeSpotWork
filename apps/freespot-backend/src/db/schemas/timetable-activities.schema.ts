import {
  ACTIVITY_TYPES,
  WEEK_DAYS,
  WEEK_PARITIES,
} from "../../schemas/common.constants";
import { CollectionSpec } from "../migrate/helpers";

export const timetableActivitiesSpec: CollectionSpec = {
  name: "timetable_activities",
  validator: {
    bsonType: "object",
    required: [
      "_id",
      "roomId",
      "date",
      "weekDay",
      "activityType",
      "subjectId",
      "cohortIds",
      "startHour",
      "endHour",
      "weekParity",
      "capacity",
      "reservedSpots",
      "busySpots",
      "freeSpots",
    ],
    properties: {
      _id: { bsonType: "objectId" },
      roomId: { bsonType: "objectId" },
      subjectId: { bsonType: "objectId" },
      date: { bsonType: "string" },
      weekDay: {
        enum: [...WEEK_DAYS],
      },
      activityType: {
        enum: [...ACTIVITY_TYPES],
      },
      cohortIds: {
        bsonType: "array",
        uniqueItems: true,
        items: { bsonType: "objectId" },
      },
      startHour: { bsonType: "int", minimum: 0, maximum: 23 },
      endHour: { bsonType: "int", minimum: 1, maximum: 24 },
      weekParity: { enum: [...WEEK_PARITIES] },
      capacity: { bsonType: "int", minimum: 0 },
      reservedSpots: { bsonType: "int", minimum: 0 },
      busySpots: { bsonType: "int", minimum: 0 },
      freeSpots: { bsonType: "int", minimum: 0 },
    },
    additionalProperties: false,
  },
  indexes: [
    { key: { roomId: 1, date: 1, startHour: 1 }, name: "by_room_date_start" },
    { key: { roomId: 1, date: 1, startHour: 1, endHour: 1 }, name: "uniq_room_date_slot", unique: true },
    { key: { cohortIds: 1, date: 1, startHour: 1 }, name: "by_cohort_date_start" },
    { key: { date: 1 }, name: "by_date" },
    { key: { subjectId: 1, date: 1 }, name: "by_subject_date" },
    { key: { activityType: 1, date: 1 }, name: "by_type_date" },
  ],
};
