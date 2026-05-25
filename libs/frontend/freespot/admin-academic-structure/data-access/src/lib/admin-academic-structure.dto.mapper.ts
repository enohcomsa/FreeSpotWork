import {
  DegreeDTO,
  type CohortCreateDTO,
  type CohortResponseDTO,
  type CohortTypeDTO,
  type FacultyResponseDTO,
  type FacultyUpdateDTO,
  type ProgramCreateDTO,
  type ProgramResponseDTO,
  type ProgramUpdateDTO,
  type ProgramYearCreateDTO,
  type ProgramYearResponseDTO,
  type ProgramYearUpdateDTO,
  type SubjectResponseDTO,
  type UserResponseDTO,
  type UserUpdateDTO,
} from '@free-spot/api-client';

import {
  type AdminAcademicCohortType,
  type AdminAcademicDegreeType,
  type AdminAcademicUser,
  type AdminCohort,
  type AdminFaculty,
  type AdminProgram,
  type AdminProgramYear,
  type AdminSubjectItem,
  type CreateAdminCohortCmd,
  type CreateAdminProgramCmd,
  type CreateAdminProgramYearCmd,
  type UpdateAdminAcademicUserCmd,
  type UpdateAdminFacultyCmd,
  type UpdateAdminProgramCmd,
  type UpdateAdminProgramYearCmd,
} from '@free-spot/admin-academic-structure/domain';

export function facultyDtoToDomain(dto: FacultyResponseDTO): AdminFaculty {
  return {
    id: dto.id,
    name: dto.name,
    subjectList: dto.subjectList ?? [],
  };
}

export function subjectDtoToDomain(dto: SubjectResponseDTO): AdminSubjectItem {
  return {
    id: dto.id,
    name: dto.name,
    shortName: dto.shortName,
  };
}

export function programDtoToDomain(dto: ProgramResponseDTO): AdminProgram {
  return {
    id: dto.id,
    facultyId: dto.facultyId,
    name: dto.name,
    degree: toDegree(dto.degree),
    active: dto.active,
  };
}

export function programYearDtoToDomain(dto: ProgramYearResponseDTO): AdminProgramYear {
  return {
    id: dto.id,
    programId: dto.programId,
    label: dto.label,
    yearNumber: dto.yearNumber,
  };
}

export function cohortDtoToDomain(dto: CohortResponseDTO): AdminCohort {
  return {
    id: dto.id,
    type: toCohortType(dto.type),
    programYearId: dto.programYearId,
    name: dto.name,
    parentGroupId: dto.parentGroupId ?? null,
  };
}

export function academicUserDtoToDomain(dto: UserResponseDTO): AdminAcademicUser {
  return {
    id: dto.id,
    firstName: dto.firstName,
    familyName: dto.familyName,
    groupCohortId: dto.groupCohortId,
    semigroupCohortId: dto.semigroupCohortId,
  };
}

export function updateFacultyCmdToDto(cmd: UpdateAdminFacultyCmd): FacultyUpdateDTO {
  return {
    subjectList: cmd.subjectList,
  };
}

export function createProgramCmdToDto(cmd: CreateAdminProgramCmd): ProgramCreateDTO {
  return {
    facultyId: cmd.facultyId,
    name: cmd.name,
    degree: toDegreeDto(cmd.degree),
    active: cmd.active,
  };
}

export function updateProgramCmdToDto(cmd: UpdateAdminProgramCmd): ProgramUpdateDTO {
  return {
    facultyId: cmd.facultyId,
    name: cmd.name,
    degree: cmd.degree ? toDegreeDto(cmd.degree) : undefined,
    active: cmd.active,
  };
}

export function createProgramYearCmdToDto(cmd: CreateAdminProgramYearCmd): ProgramYearCreateDTO {
  return {
    programId: cmd.programId,
    label: cmd.label,
    yearNumber: cmd.yearNumber,
  };
}

export function updateProgramYearCmdToDto(cmd: UpdateAdminProgramYearCmd): ProgramYearUpdateDTO {
  return {
    programId: cmd.programId,
    label: cmd.label,
    yearNumber: cmd.yearNumber,
  };
}

export function createCohortCmdToDto(cmd: CreateAdminCohortCmd): CohortCreateDTO {
  return {
    type: toCohortTypeDto(cmd.type),
    programYearId: cmd.programYearId,
    name: cmd.name,
    parentGroupId: cmd.parentGroupId ?? null,
  };
}

export function updateAcademicUserCmdToDto(cmd: UpdateAdminAcademicUserCmd): UserUpdateDTO {
  return {
    groupCohortId: cmd.groupCohortId,
    semigroupCohortId: cmd.semigroupCohortId,
  };
}

function toDegree(value: DegreeDTO | undefined): AdminAcademicDegreeType {
  switch (value) {
    case DegreeDTO.LIC:
      return 'LIC';
    case DegreeDTO.MASTER:
      return 'MASTER';
    case DegreeDTO.DOCT:
      return 'DOCT';
    default:
      throw new Error('Missing degree');
  }
}

function toDegreeDto(value: AdminAcademicDegreeType): DegreeDTO {
  switch (value) {
    case 'LIC':
      return DegreeDTO.LIC;
    case 'MASTER':
      return DegreeDTO.MASTER;
    case 'DOCT':
      return DegreeDTO.DOCT;
  }
}

function toCohortType(value: CohortTypeDTO | undefined): AdminAcademicCohortType {
  if (!value) {
    throw new Error('Missing cohort type');
  }

  return value as AdminAcademicCohortType;
}

function toCohortTypeDto(value: AdminAcademicCohortType): CohortTypeDTO {
  return value as CohortTypeDTO;
}
