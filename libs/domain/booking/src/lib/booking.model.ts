import { ActivityType, BookingStatus } from '@free-spot/enums';

export interface Booking {
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
  status: BookingStatus;

  originalActivityId: string | null;
  isRescheduled: boolean | null;
  rescheduledAt: string | null;

  createdAt: string;
  updatedAt: string | null;
}
