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
