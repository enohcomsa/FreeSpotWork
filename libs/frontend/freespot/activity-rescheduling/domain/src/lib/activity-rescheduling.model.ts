import { WeekDay, WeekParity, ActivityType } from '@free-spot/shared/domain';
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
  activityType: ActivityType;
  status: ActivityReschedulingBookingStatus;
  originalActivityId: string | null;
  isRescheduled: boolean | null;
  rescheduledAt: string | null;
  createdAt: string | null;
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

export type ActivityReschedulingBookingStatus = 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED';
