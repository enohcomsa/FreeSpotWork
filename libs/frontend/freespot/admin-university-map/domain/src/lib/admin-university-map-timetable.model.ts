import { WeekDay, WeekParity } from '@free-spot/shared/domain';

export type AdminUniversityMapActivityType =
  | 'LABORATORY'
  | 'COURSE'
  | 'PROJECT'
  | 'SEMINAR'
  | 'SPECIAL_EVENT';


export interface AdminUniversityMapSubject {
  id: string;
  name: string;
  shortName: string;
}

export interface AdminUniversityMapTimetableActivity {
  id: string;
  roomId: string;
  subjectId: string;
  weekDay: WeekDay;
  startHour: number;
  endHour: number;
  weekParity: WeekParity;
  activityType: AdminUniversityMapActivityType;
}

export interface CreateAdminUniversityMapTimetableActivityCmd {
  roomId: string;
  subjectId: string;
  date: string;
  weekDay: WeekDay;
  activityType: AdminUniversityMapActivityType;
  cohortIds: string[];
  startHour: number;
  endHour: number;
  weekParity: WeekParity;
  capacity: number;
  reservedSpots: number;
  busySpots: number;
  freeSpots: number;
}
