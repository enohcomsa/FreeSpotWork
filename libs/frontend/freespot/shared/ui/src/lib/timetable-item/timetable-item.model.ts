import { WeekDay, WeekParity } from '@free-spot/shared/domain';

export type TimetableActivityVm = {
  id: string;
  weekDay: WeekDay;
  startHour: number;
  endHour: number;
  weekParity: WeekParity;
  activityType: string;
  roomName: string;
  subjectItemShortName: string;
};

export type TimetableDayItemVm = {
  hourInterval: string;
  startHour: number;
  evenWeekActivity?: TimetableActivityVm;
  oddWeekActivity?: TimetableActivityVm;
  bothWeekActivity?: TimetableActivityVm;
};
