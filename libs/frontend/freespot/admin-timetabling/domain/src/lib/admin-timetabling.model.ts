export type AdminTimetableActivityType =
  | 'LABORATORY'
  | 'COURSE'
  | 'PROJECT'
  | 'SEMINAR'
  | 'SPECIAL_EVENT';

export type AdminTimetableWeekDay =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type AdminTimetableWeekParity = 'BOTH' | 'EVEN' | 'ODD';

export interface AdminTimetableActivity {
  id: string;
  roomId: string;
  subjectId: string;
  date: string;
  weekDay: AdminTimetableWeekDay;
  activityType: AdminTimetableActivityType;
  cohortIds: string[];
  startHour: number;
  endHour: number;
  weekParity: AdminTimetableWeekParity;
  capacity: number;
  reservedSpots: number;
  busySpots: number;
  freeSpots: number;
}

export interface UpdateAdminTimetableActivityCmd {
  roomId?: string;
  subjectId?: string;
  date?: string;
  weekDay?: AdminTimetableWeekDay;
  activityType?: AdminTimetableActivityType;
  cohortIds?: string[];
  startHour?: number;
  endHour?: number;
  weekParity?: AdminTimetableWeekParity;
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
