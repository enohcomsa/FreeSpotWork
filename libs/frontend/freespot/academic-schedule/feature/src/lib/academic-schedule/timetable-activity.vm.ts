import { WeekDay, WeekParity,ActivityType } from '@free-spot/shared/domain';

export type TimetableActivityCardVM = {
  id: string;
  weekDay: WeekDay;
  startHour: number;
  endHour: number;
  weekParity: WeekParity;
  activityType: ActivityType;
  roomName: string;
  subjectItemShortName: string;
};

export type TimetableDayVM = {
  day: WeekDay;
  activities: TimetableActivityCardVM[];
};
