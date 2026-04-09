import { WeekDay, WeekParity, ActivityType } from '@frontend/freespot/schedule/domain';
export interface TimetableActivityCardVM {
  id: string,
  weekDay: WeekDay,
  startHour: number,
  endHour: number,
  weekParity: WeekParity,
  activityType: ActivityType,
  roomName: string,
  subjectItemShortName: string,
}
