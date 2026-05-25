export type ActivityBookingActivityType =
  | 'LABORATORY'
  | 'COURSE'
  | 'PROJECT'
  | 'SEMINAR'
  | 'SPECIAL_EVENT';

export type ActivityBookingWeekDay =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type ActivityBookingWeekParity = 'ODD' | 'EVEN' | 'BOTH';

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
  activityType: ActivityBookingActivityType;
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
};
