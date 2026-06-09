export type WeekDay =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type WeekParity =
  | 'ODD'
  | 'EVEN'
  | 'BOTH';

export type ActivityType =
  | 'LABORATORY'
  | 'COURSE'
  | 'PROJECT'
  | 'SEMINAR'
  | 'SPECIAL_EVENT';

export interface TimetableActivity {
  id: string;
  weekDay: WeekDay;
  startHour: number;
  endHour: number;
  weekParity: WeekParity;
}
