export enum ActivityBookingActivityType {
  LABORATORY = 'LABORATORY',
  COURSE = 'COURSE',
  PROJECT = 'PROJECT',
  SEMINAR = 'SEMINAR',
  SPECIAL_EVENT = 'SPECIAL_EVENT',
}

export enum ActivityBookingWeekDay {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export enum ActivityBookingWeekParity {
  ODD = 'ODD',
  EVEN = 'EVEN',
  BOTH = 'BOTH',
}

export interface ActivityBookingCardVm {
  id: string;
  activityType: ActivityBookingActivityType;
  subjectName: string;
  buildingName: string;
  floorName: string;
  roomName: string;
  date: string;
  startHour: number;
  endHour: number;
}

export type BookingStatus = 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED';

export interface ActivityBooking {
  id: string;
  activityId: string;
  userId: string;
  facultyId: string | null;
  programId: string | null;
  programYearId: string | null;
  groupCohortId: string | null;
  semigroupCohortId: string | null;
  subjectId: string | null;
  activityType: ActivityBookingActivityType;
  status: BookingStatus;
  originalActivityId: string | null;
  isRescheduled: boolean | null;
  rescheduledAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface ActivityBookingSubject {
  id: string;
  name: string;
  shortName?: string;
}

export interface ActivityBookingActivity {
  id: string;
  roomId: string;
  subjectId: string;
  date: string;
  weekDay: ActivityBookingWeekDay;
  activityType: ActivityBookingActivityType;
  cohortIds: string[];
  startHour: number;
  endHour: number;
  weekParity: ActivityBookingWeekParity;
  capacity: number;
  reservedSpots: number;
  busySpots: number;
  freeSpots: number;
}

export interface ActivityBookingRoom {
  id: string;
  buildingId: string;
  floorId: string;
  name: string;
  totalSpotsNumber: number;
  unavailableSpots: number;
  subjectList: string[];
}

export interface ActivityBookingBuilding {
  id: string;
  name: string;
  address: string;
}

export interface ActivityBookingFloor {
  id: string;
  buildingId: string;
  name: string;
}
