import { WeekParity, ActivityType, WeekDay } from "@free-spot/enums";


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
