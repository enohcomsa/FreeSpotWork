export type ActivityType =
  | 'LABORATORY'
  | 'COURSE'
  | 'PROJECT'
  | 'SEMINAR'
  | 'SPECIAL_EVENT';

export type WeekDay =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type WeekParity = 'ODD' | 'EVEN' | 'BOTH';

export type TimetableActivity = {
  id: string;
  roomId: string;
  subjectId: string;
  date: string;
  weekDay: WeekDay;
  activityType: ActivityType;
  cohortIds: string[];
  startHour: number;
  endHour: number;
  weekParity: WeekParity;
  capacity: number;
  reservedSpots: number;
  busySpots: number;
  freeSpots: number;
};

export type CreateTimetableActivityCmd = {
  roomId: string;
  subjectId: string;
  date: string;
  weekDay: WeekDay;
  activityType: ActivityType;
  cohortIds: string[];
  startHour: number;
  endHour: number;
  weekParity: WeekParity;
  capacity: number;
  reservedSpots: number;
  busySpots: number;
  freeSpots: number;
};

export type UpdateTimetableActivityCmd = Partial<CreateTimetableActivityCmd>;
