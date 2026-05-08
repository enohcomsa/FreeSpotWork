import { ActivityType } from './activity-type.enum';
import { WeekDay } from './week-day.enum';
import { WeekParity } from './week-parity.enum';

export interface TimetableActivityCardVM {
  id: string;
  weekDay: WeekDay;
  startHour: number;
  endHour: number;
  weekParity: WeekParity;
  activityType: ActivityType;
  roomName: string;
  subjectItemShortName: string;
}
