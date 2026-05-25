export type AdminAcademicActivityType =
  | 'LABORATORY'
  | 'COURSE'
  | 'PROJECT'
  | 'SEMINAR'
  | 'SPECIAL_EVENT';

export type AdminAcademicWeekDay =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type AdminAcademicWeekParity = 'BOTH' | 'EVEN' | 'ODD';

export interface AdminAcademicRoom {
  id: string;
  name: string;
}

export interface AdminAcademicTimetableActivity {
  id: string;
  roomId: string;
  subjectId: string;
  cohortIds: string[];
  weekDay: AdminAcademicWeekDay;
  startHour: number;
  endHour: number;
  weekParity: AdminAcademicWeekParity;
  activityType: AdminAcademicActivityType;
}
