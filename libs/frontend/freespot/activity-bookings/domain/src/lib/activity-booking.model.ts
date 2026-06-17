import { WeekDay, WeekParity, ActivityType } from "@free-spot/shared/domain";

export type ActivityBookingStatus = 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED';

export type ActivityBooking = {
  id: string;
  activityId: string;
  userId: string;
  facultyId: string | null;
  programId: string | null;
  programYearId: string | null;
  groupCohortId: string | null;
  semigroupCohortId: string | null;
  subjectId: string | null;
  activityType: ActivityType;
  status: ActivityBookingStatus;
  originalActivityId: string | null;
  isRescheduled: boolean | null;
  rescheduledAt: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type ActivityBookingActivity = {
  id: string;
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
};
