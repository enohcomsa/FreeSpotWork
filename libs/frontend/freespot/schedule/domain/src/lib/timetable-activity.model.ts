
import { ActivityType } from "./activity-type.enum";
import { WeekDay } from "./week-day.enum";
import { WeekParity } from "./week-parity.enum";

export interface TimetableActivity {
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
  id: string;
}
