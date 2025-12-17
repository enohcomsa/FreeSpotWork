import { WeekParity, ActivityType, WeekDay } from "@free-spot/enums";

export type CreateTimetableActivityCmd = {
  roomId: string;
  subjectId: string;
  date: string;
  weekDay: WeekDay;
  activityType: ActivityType;
  cohortIds: string[];
  startHour: number;
  endHour: number;
  weekParity: WeekParity;
  capacity: number;
  reservedSpots: number;
  busySpots: number;
  freeSpots: number;
}

export type UpdateTimetableActivityCmd = Partial<CreateTimetableActivityCmd>;
