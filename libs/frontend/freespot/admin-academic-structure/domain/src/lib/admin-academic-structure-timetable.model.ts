import { WeekDay, WeekParity, ActivityType } from '@free-spot/shared/domain';

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
  activityType: ActivityType;
}
