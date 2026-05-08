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
