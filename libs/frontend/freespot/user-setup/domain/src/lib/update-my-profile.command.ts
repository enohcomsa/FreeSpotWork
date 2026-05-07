export type UpdateMyProfileCmd = {
  firstName: string;
  familyName: string;
  facultyId: string;
  programId: string;
  programYearId: string;
  groupCohortId: string;
  semigroupCohortId?: string | null;
};
