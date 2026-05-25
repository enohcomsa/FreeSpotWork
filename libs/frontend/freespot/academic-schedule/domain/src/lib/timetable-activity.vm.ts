import { WeekDay, WeekParity, ActivityType } from './timetable-activity.model';

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
