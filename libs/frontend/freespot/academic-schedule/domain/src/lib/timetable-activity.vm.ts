import { WeekDay, WeekParity } from '@free-spot/shared/domain';
import { ActivityType } from './timetable-activity.model';

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
