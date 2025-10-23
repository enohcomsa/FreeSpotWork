import { ObjectId } from "mongodb";
import type { ActivityTypeT, WeekDayT, WeekParityT } from "../../schemas/common.zod";

export type TimetableActivityDbBase = {
  roomId: ObjectId;
  subjectId: ObjectId;
  date: string;
  weekDay: WeekDayT;
  activityType: ActivityTypeT;
  cohortIds: ObjectId[];
  startHour: number;
  endHour: number;
  weekParity: WeekParityT;
  capacity: number;
  reservedSpots: number;
  busySpots: number;
  freeSpots: number;
};

export type TimetableActivityDbDoc = TimetableActivityDbBase & { _id: ObjectId };
export type TimetableActivityDbRecord = TimetableActivityDbBase;
