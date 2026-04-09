import { ActivityType } from "@frontend/freespot/schedule/domain";


export interface CurrentBookingForReschedule {
  id: string;
  activityId: string;
  subjectId: string | null;
  activityType: ActivityType;
  programYearId: string | null;
  groupCohortId: string | null;
  semigroupCohortId: string | null;
  originalActivityId: string | null;
  isRescheduled: boolean | null;
  rescheduledAt: string | null;
}

export interface RescheduleOption {
  activityId: string;
  subjectId: string;
  activityType: ActivityType;
  date: string;
  weekDay: string;
  startHour: number;
  endHour: number;
  capacity: number;
  reservedSpots: number;
  busySpots: number;
  freeSpots: number;
  cohortIds: string[];
}

export interface RescheduleOptionsResult {
  currentBooking: CurrentBookingForReschedule;
  items: RescheduleOption[];
  total: number;
}
