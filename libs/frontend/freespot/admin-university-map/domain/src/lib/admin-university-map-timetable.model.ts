export type AdminUniversityMapActivityType =
  | 'LABORATORY'
  | 'COURSE'
  | 'PROJECT'
  | 'SEMINAR'
  | 'SPECIAL_EVENT';

export type AdminUniversityMapWeekDay =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type AdminUniversityMapWeekParity = 'BOTH' | 'EVEN' | 'ODD';

export interface AdminUniversityMapSubject {
  id: string;
  name: string;
  shortName: string;
}

export interface AdminUniversityMapTimetableActivity {
  id: string;
  roomId: string;
  subjectId: string;
  weekDay: AdminUniversityMapWeekDay;
  startHour: number;
  endHour: number;
  weekParity: AdminUniversityMapWeekParity;
  activityType: AdminUniversityMapActivityType;
}

export interface CreateAdminUniversityMapTimetableActivityCmd {
  roomId: string;
  subjectId: string;
  date: string;
  weekDay: AdminUniversityMapWeekDay;
  activityType: AdminUniversityMapActivityType;
  cohortIds: string[];
  startHour: number;
  endHour: number;
  weekParity: AdminUniversityMapWeekParity;
  capacity: number;
  reservedSpots: number;
  busySpots: number;
  freeSpots: number;
}
