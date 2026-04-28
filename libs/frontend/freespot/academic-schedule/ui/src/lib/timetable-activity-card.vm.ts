import { WeekDay, WeekParity, ActivityType } from '@free-spot/academic-schedule/domain';
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
