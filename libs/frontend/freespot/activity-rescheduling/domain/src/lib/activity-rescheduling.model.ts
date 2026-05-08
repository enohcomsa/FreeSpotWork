export enum ActivityReschedulingActivityType {
  LABORATORY = 'LABORATORY',
  COURSE = 'COURSE',
  PROJECT = 'PROJECT',
  SEMINAR = 'SEMINAR',
  SPECIAL_EVENT = 'SPECIAL_EVENT',
}

export enum ActivityReschedulingWeekDay {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export enum ActivityReschedulingWeekParity {
  ODD = 'ODD',
  EVEN = 'EVEN',
  BOTH = 'BOTH',
}

export type ActivityReschedulingBookingStatus = 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED';

export interface ActivityReschedulingBooking {
  id: string;
  activityId: string;
  userId: string;
  facultyId: string | null;
  programId: string | null;
  programYearId: string | null;
  groupCohortId: string | null;
  semigroupCohortId: string | null;
  subjectId: string | null;
  activityType: ActivityReschedulingActivityType;
  status: ActivityReschedulingBookingStatus;
  originalActivityId: string | null;
  isRescheduled: boolean | null;
  rescheduledAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface ActivityReschedulingSubject {
  id: string;
  name: string;
  shortName?: string;
}

export interface ActivityReschedulingActivity {
  id: string;
  roomId: string;
  subjectId: string;
  date: string;
  weekDay: ActivityReschedulingWeekDay;
  activityType: ActivityReschedulingActivityType;
  cohortIds: string[];
  startHour: number;
  endHour: number;
  weekParity: ActivityReschedulingWeekParity;
  capacity: number;
  reservedSpots: number;
  busySpots: number;
  freeSpots: number;
}

export interface ActivityReschedulingRoom {
  id: string;
  buildingId: string;
  floorId: string;
  name: string;
  totalSpotsNumber: number;
  unavailableSpots: number;
  subjectList: string[];
}

export interface ActivityReschedulingBuilding {
  id: string;
  name: string;
  address: string;
}

export interface ActivityReschedulingFloor {
  id: string;
  buildingId: string;
  name: string;
}

export interface ActivityReschedulingOption {
  activityId: string;
  freeSpots: number;
}

export interface ActivityReschedulingOptionsResult {
  items: ActivityReschedulingOption[];
}

export interface ActivityRescheduleBookingCmd {
  activityId: string;
}

export interface ReschedulableBookingVm {
  id: string;
  label: string;
}

export interface RescheduleOptionCardVm {
  id: string;
  subjectName: string;
  buildingName: string;
  floorName: string;
  roomName: string;
  date: string;
  startHour: number;
  endHour: number;
  freeSpots: number;
}
