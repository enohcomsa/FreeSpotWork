import { ObjectId } from "mongodb";
import type { BookingStatusT, SourceTypeT } from "../../schemas/common.zod";

export type BookingSourceDb = {
  type: SourceTypeT;
  id: ObjectId;
};

export type BookingDbBase = {
  activityId: ObjectId;
  userId: ObjectId;
  cohortId?: ObjectId | null;
  status: BookingStatusT;
  createdAt: Date;
  updatedAt?: Date | null;
  source?: BookingSourceDb | null;
};

export type BookingDbDoc = BookingDbBase & { _id: ObjectId };
export type BookingDbRecord = BookingDbBase;
