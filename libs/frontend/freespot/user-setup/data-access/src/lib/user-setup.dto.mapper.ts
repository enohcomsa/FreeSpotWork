import {
  AuthUserDTO,
  CohortResponseDTO,
  FacultyResponseDTO,
  ProgramResponseDTO,
  ProgramYearResponseDTO,
  UserMeProfileUpdateDTO,
  PreferredLanguageDTO,
  PreferredThemeDTO,
  UserRoleDTO
} from '@free-spot/api-client';
import { Role, Language, Theme, type User } from '@free-spot/core/domain';
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
    role: mapRole(dto.role),
    preferredLanguage: mapLanguage(dto.preferredLanguage),
    preferredTheme: mapTheme(dto.preferredTheme),
    facultyId: dto.facultyId,
    programId: dto.programId,
    programYearId: dto.programYearId,
    groupCohortId: dto.groupCohortId,
    semigroupCohortId: dto.semigroupCohortId ?? null,
  };
}

export function toMyProfileUpdateDTO(cmd: UpdateMyProfileCmd): UserMeProfileUpdateDTO {
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

export function dtoToUserSetupFaculty(dto: FacultyResponseDTO): UserSetupFaculty {
  if (!dto.id) {
    throw new Error('Faculty id is required');
  }

  return {
    id: dto.id,
    name: dto.name ?? '',
  };
}

export function dtoToUserSetupProgram(dto: ProgramResponseDTO): UserSetupProgram {
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

export function dtoToUserSetupProgramYear(dto: ProgramYearResponseDTO): UserSetupProgramYear {
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

export function dtoToUserSetupCohort(dto: CohortResponseDTO): UserSetupCohort {
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

function mapRole(value: UserRoleDTO): Role {
  switch (value) {
    case UserRoleDTO.ADMIN:
      return Role.ADMIN;
    case UserRoleDTO.MEMBER:
      return Role.MEMBER;
    default:
      throw new Error('Invalid user role');
  }
}

function mapLanguage(value: PreferredLanguageDTO | null | undefined): Language {
  switch (value) {
    case PreferredLanguageDTO.EN:
      return Language.EN;
    case PreferredLanguageDTO.RO:
      return Language.RO;
    case null:
    case undefined:
      return Language.EN;
    default:
      throw new Error('Invalid user language');
  }
}

function mapTheme(value: PreferredThemeDTO | null | undefined): Theme {
  switch (value) {
    case PreferredThemeDTO.DARK:
      return Theme.DARK;
    case PreferredThemeDTO.LIGHT:
      return Theme.LIGHT;
    case null:
    case undefined:
      return Theme.LIGHT;
    default:
      throw new Error('Invalid user theme');
  }
}
