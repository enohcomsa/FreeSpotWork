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

export type ActivityReschedulingActivityType =
  | 'LABORATORY'
  | 'COURSE'
  | 'PROJECT'
  | 'SEMINAR'
  | 'SPECIAL_EVENT';

export type ActivityReschedulingWeekDay =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type ActivityReschedulingWeekParity = 'ODD' | 'EVEN' | 'BOTH';

export type ActivityReschedulingBookingStatus = 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED';
