export interface UserSetupFaculty {
  id: string;
  name: string;
}

export interface UserSetupProgram {
  id: string;
  name: string;
  facultyId: string;
}

export interface UserSetupProgramYear {
  id: string;
  name: string;
  programId: string;
}

export interface UserSetupCohort {
  id: string;
  name: string;
  programYearId: string;
  parentGroupId: string | null;
}

export type UpdateMyProfileCmd = {
  firstName: string;
  familyName: string;
  facultyId: string;
  programId: string;
  programYearId: string;
  groupCohortId: string;
  semigroupCohortId?: string | null;
};
