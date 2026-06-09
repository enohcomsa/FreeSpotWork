import { WeekDay, WeekParity } from '@free-spot/shared/domain';

export type TimetableUiActivity = {
  id: string;
  weekDay: WeekDay;
  startHour: number;
  endHour: number;
  weekParity: WeekParity;
  activityType: string;
  roomName: string;
  subjectItemShortName: string;
};

export type TimetableDayItem = {
  hourInterval: string;
  startHour: number;
  evenWeekActivity?: TimetableUiActivity;
  oddWeekActivity?: TimetableUiActivity;
  bothWeekActivity?: TimetableUiActivity;
};
