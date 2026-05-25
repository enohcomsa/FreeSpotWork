export type TimetableUiWeekDay =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type TimetableUiWeekParity = 'ODD' | 'EVEN' | 'BOTH';

export type TimetableUiActivity = {
  id: string;
  weekDay: TimetableUiWeekDay;
  startHour: number;
  endHour: number;
  weekParity: TimetableUiWeekParity;
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
