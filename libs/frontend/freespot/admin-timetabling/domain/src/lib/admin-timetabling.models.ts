export enum AdminTimetableActivityType {
  Laboratory = 'LABORATORY',
  Course = 'COURSE',
  Project = 'PROJECT',
  Seminar = 'SEMINAR',
  SpecialEvent = 'SPECIAL_EVENT',
}

export enum AdminTimetableWeekDay {
  Monday = 'MONDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY',
  Thursday = 'THURSDAY',
  Friday = 'FRIDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY',
}

export enum AdminTimetableWeekParity {
  Both = 'BOTH',
  Even = 'EVEN',
  Odd = 'ODD',
}

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
export interface AdminTimetablingRoom {
  id: string;
  name: string;
  buildingId: string;
  floorId: string;
  totalSpotsNumber: number;
  unavailableSpots: number;
  subjectList: string[];
}

export interface AdminTimetablingSubject {
  id: string;
  name: string;
  shortName: string;
}

export interface AdminTimetablingUser {
  id: string;
  email: string;
  username?: string | null;
  firstName: string | null;
  familyName: string | null;
  facultyId: string | null;
  programId: string | null;
  programYearId: string | null;
  groupCohortId: string | null;
  semigroupCohortId?: string | null;
}

export interface UpdateAdminTimetablingUserCmd {
  groupCohortId?: string | null;
  semigroupCohortId?: string | null;
}

export interface AdminTimetablingBooking {
  id: string;
  activityId: string;
  userId: string;
}
