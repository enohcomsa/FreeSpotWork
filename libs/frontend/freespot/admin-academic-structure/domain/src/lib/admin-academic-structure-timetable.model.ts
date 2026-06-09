import { WeekDay, WeekParity } from '@free-spot/shared/domain';

export type AdminAcademicActivityType =
  | 'LABORATORY'
  | 'COURSE'
  | 'PROJECT'
  | 'SEMINAR'
  | 'SPECIAL_EVENT';

export interface AdminAcademicRoom {
  id: string;
  name: string;
}

export interface AdminAcademicTimetableActivity {
  id: string;
  roomId: string;
  subjectId: string;
  cohortIds: string[];
  weekDay: WeekDay;
  startHour: number;
  endHour: number;
  weekParity: WeekParity;
  activityType: AdminAcademicActivityType;
}
