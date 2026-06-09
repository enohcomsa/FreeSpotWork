import { WeekDay, WeekParity } from '@free-spot/shared/domain';

export type AdminTimetableActivityType =
  | 'LABORATORY'
  | 'COURSE'
  | 'PROJECT'
  | 'SEMINAR'
  | 'SPECIAL_EVENT';

export interface AdminTimetableActivity {
  id: string;
  roomId: string;
  subjectId: string;
  date: string;
  weekDay: WeekDay;
  activityType: AdminTimetableActivityType;
  cohortIds: string[];
  startHour: number;
  endHour: number;
  weekParity: WeekParity;
  capacity: number;
  reservedSpots: number;
  busySpots: number;
  freeSpots: number;
}

export interface UpdateAdminTimetableActivityCmd {
  roomId?: string;
  subjectId?: string;
  date?: string;
  weekDay?: WeekDay;
  activityType?: AdminTimetableActivityType;
  cohortIds?: string[];
  startHour?: number;
  endHour?: number;
  weekParity?: WeekParity;
  capacity?: number;
  reservedSpots?: number;
  busySpots?: number;
  freeSpots?: number;
}

export interface AdminTimetablingSubject {
  id: string;
  name: string;
  shortName: string;
}

export interface AdminTimetablingRoom {
  id: string;
  name: string;
  buildingId: string;
  floorId: string;
  totalSpotsNumber: number;
  unavailableSpots: number;
  subjectList: string[];
}
