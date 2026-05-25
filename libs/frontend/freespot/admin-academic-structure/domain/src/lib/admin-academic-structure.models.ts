export enum AdminAcademicDegreeType {
  Lic = 'LIC',
  Master = 'MASTER',
  Doct = 'DOCT',
}

export enum AdminAcademicCohortType {
  Group = 'GROUP',
  Semigroup = 'SEMIGROUP',
}

export interface AdminFaculty {
  id: string;
  name: string;
  subjectList: string[];
}

export interface UpdateAdminFacultyCmd {
  subjectList?: string[];
}

export interface AdminSubjectItem {
  id: string;
  name: string;
  shortName: string;
}

export interface AdminProgram {
  id: string;
  facultyId: string;
  name: string;
  degree?: AdminAcademicDegreeType;
  active?: boolean;
}

export interface CreateAdminProgramCmd {
  facultyId: string;
  name: string;
  degree: AdminAcademicDegreeType;
  active: boolean;
}

export interface UpdateAdminProgramCmd {
  facultyId?: string;
  name?: string;
  degree?: AdminAcademicDegreeType;
  active?: boolean;
}

export interface AdminProgramYear {
  id: string;
  programId: string;
  label: string;
  yearNumber?: number;
}

export interface CreateAdminProgramYearCmd {
  programId: string;
  label: string;
  yearNumber: number;
}

export interface UpdateAdminProgramYearCmd {
  programId?: string;
  label?: string;
  yearNumber?: number;
}

export interface AdminCohort {
  id: string;
  type: AdminAcademicCohortType;
  programYearId: string;
  name: string;
  parentGroupId?: string | null;
}

export interface CreateAdminCohortCmd {
  type: AdminAcademicCohortType;
  programYearId: string;
  name: string;
  parentGroupId?: string | null;
}

export interface AdminAcademicUser {
  id: string;
  firstName: string | null;
  familyName: string | null;
  groupCohortId: string | null;
  semigroupCohortId?: string | null;
}

export interface UpdateAdminAcademicUserCmd {
  groupCohortId?: string | null;
  semigroupCohortId?: string | null;
}

export interface AdminAcademicRoom {
  id: string;
  name: string;
}

export enum AdminAcademicActivityType {
  Laboratory = 'LABORATORY',
  Course = 'COURSE',
  Project = 'PROJECT',
  Seminar = 'SEMINAR',
  SpecialEvent = 'SPECIAL_EVENT',
}

export enum AdminAcademicWeekDay {
  Monday = 'MONDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY',
  Thursday = 'THURSDAY',
  Friday = 'FRIDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY',
}

export enum AdminAcademicWeekParity {
  Both = 'BOTH',
  Even = 'EVEN',
  Odd = 'ODD',
}

export interface AdminAcademicTimetableActivity {
  id: string;
  roomId: string;
  subjectId: string;
  cohortIds: string[];
  weekDay: AdminAcademicWeekDay;
  startHour: number;
  endHour: number;
  weekParity: AdminAcademicWeekParity;
  activityType: AdminAcademicActivityType;
}
