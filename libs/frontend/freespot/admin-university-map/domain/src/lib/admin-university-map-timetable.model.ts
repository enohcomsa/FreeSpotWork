import { WeekDay, WeekParity, ActivityType } from '@free-spot/shared/domain';

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
  activityType: ActivityType;
}

export interface CreateAdminUniversityMapTimetableActivityCmd {
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
}
