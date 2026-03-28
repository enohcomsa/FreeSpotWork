import { ObjectId } from "mongodb";
import type { ActivityTypeT, BookingStatusT } from "../../schemas/common.zod";

export type BookingDbBase = {
  activityId: ObjectId;
  userId: ObjectId;

  facultyId: ObjectId | null;
  programId: ObjectId | null;
  programYearId: ObjectId | null;
  groupCohortId: ObjectId | null;
  semigroupCohortId: ObjectId | null;

  subjectId: ObjectId | null;
  activityType: ActivityTypeT;

  status: BookingStatusT;

  originalActivityId?: ObjectId | null;
  isRescheduled?: boolean | null;
  rescheduledAt?: Date | null;

  createdAt: Date;
  updatedAt?: Date | null;
};

export type BookingDbDoc = BookingDbBase & { _id: ObjectId };
export type BookingDbRecord = BookingDbBase;
