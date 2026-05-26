import {
  type AuthUserDTO,
  type CohortResponseDTO,
  type FacultyResponseDTO,
  type PreferredLanguageDTO,
  type PreferredThemeDTO,
  type ProgramResponseDTO,
  type ProgramYearResponseDTO,
  type UserMeProfileUpdateDTO,
  type UserRoleDTO,
} from '@free-spot/api-client';
import { type Language, type Role, type Theme, type User } from '@free-spot/core/domain';
import {
  type UpdateMyProfileCmd,
  type UserSetupCohort,
  type UserSetupFaculty,
  type UserSetupProgram,
  type UserSetupProgramYear,
} from '@free-spot/user-setup/domain';

export function authUserDtoToUser(dto: AuthUserDTO): User {
  return {
    id: dto.id,
    email: dto.email,
    firstName: dto.firstName,
    familyName: dto.familyName,
    role: toRole(dto.role),
    preferredLanguage: toLanguage(dto.preferredLanguage),
    preferredTheme: toTheme(dto.preferredTheme),
    facultyId: dto.facultyId,
    programId: dto.programId,
    programYearId: dto.programYearId,
    groupCohortId: dto.groupCohortId,
    semigroupCohortId: dto.semigroupCohortId ?? null,
  };
}

export function updateMyProfileCmdToDto(cmd: UpdateMyProfileCmd): UserMeProfileUpdateDTO {
  return {
    firstName: cmd.firstName,
    familyName: cmd.familyName,
    facultyId: cmd.facultyId,
    programId: cmd.programId,
    programYearId: cmd.programYearId,
    groupCohortId: cmd.groupCohortId,
    semigroupCohortId: cmd.semigroupCohortId ?? null,
  };
}

export function facultyDtoToDomain(dto: FacultyResponseDTO): UserSetupFaculty {
  if (!dto.id) {
    throw new Error('Faculty id is required');
  }

  return {
    id: dto.id,
    name: dto.name ?? '',
  };
}

export function programDtoToDomain(dto: ProgramResponseDTO): UserSetupProgram {
  if (!dto.id) {
    throw new Error('Program id is required');
  }

  if (!dto.facultyId) {
    throw new Error('Program facultyId is required');
  }

  return {
    id: dto.id,
    name: dto.name ?? '',
    facultyId: dto.facultyId,
  };
}

export function programYearDtoToDomain(dto: ProgramYearResponseDTO): UserSetupProgramYear {
  if (!dto.id) {
    throw new Error('Program year id is required');
  }

  if (!dto.programId) {
    throw new Error('Program year programId is required');
  }

  return {
    id: dto.id,
    name: dto.label ?? '',
    programId: dto.programId,
  };
}

export function cohortDtoToDomain(dto: CohortResponseDTO): UserSetupCohort {
  if (!dto.id) {
    throw new Error('Cohort id is required');
  }

  if (!dto.programYearId) {
    throw new Error('Cohort programYearId is required');
  }

  return {
    id: dto.id,
    name: dto.name ?? '',
    programYearId: dto.programYearId,
    parentGroupId: dto.parentGroupId ?? null,
  };
}

function toRole(value: UserRoleDTO | undefined): Role {
  if (!value) {
    throw new Error('Missing user role');
  }

  return value as Role;
}

function toLanguage(value: PreferredLanguageDTO | null | undefined): Language {
  if (!value) {
    return 'en';
  }

  return value as Language;
}

function toTheme(value: PreferredThemeDTO | null | undefined): Theme {
  if (!value) {
    return 'LIGHT';
  }

  return value as Theme;
}
