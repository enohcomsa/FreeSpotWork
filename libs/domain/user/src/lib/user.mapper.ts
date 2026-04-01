import {
  AuthUserDTO,
  PreferredLanguageDTO,
  PreferredThemeDTO,
  UserMePreferencesUpdateDTO,
  UserMeProfileUpdateDTO,
  UserResponseDTO,
  UserRoleDTO,
  UserUpdateDTO,
} from '@free-spot/api-client';

import { Role, Language, Theme } from '@free-spot/enums';
import { User } from './user.model';
import { UpdateMyPreferencesCmd, UpdateMyProfileCmd, UpdateUserCmd } from './user.commands';

export function authDtoToDomain(dto: AuthUserDTO): User {
  return {
    id: dto.id,
    email: dto.email,
    firstName: dto.firstName,
    familyName: dto.familyName,
    role: toRoleFromAuth(dto.role),
    preferredLanguage: toLanguageFromAuth(dto.preferredLanguage),
    preferredTheme: toThemeFromAuth(dto.preferredTheme),
    facultyId: dto.facultyId,
    programId: dto.programId,
    programYearId: dto.programYearId,
    groupCohortId: dto.groupCohortId,
    semigroupCohortId: dto.semigroupCohortId ?? null,
  };
}

export function dtoToDomain(dto: UserResponseDTO): User {
  return {
    id: dto.id,
    email: dto.email,
    username: dto.username ?? null,
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

export function toMyPreferencesUpdateDTO(cmd: UpdateMyPreferencesCmd): UserMePreferencesUpdateDTO {
  return {
    preferredLanguage: toLanguageDTO(cmd.preferredLanguage),
    preferredTheme: toThemeDTO(cmd.preferredTheme),
  };
}

export function toUpdateUserDTO(cmd: UpdateUserCmd): UserUpdateDTO {
  return {
    username: cmd.username,
    firstName: cmd.firstName,
    familyName: cmd.familyName,
    role: toRoleDTO(cmd.role),
    preferredLanguage: toLanguageDTO(cmd.preferredLanguage),
    preferredTheme: toThemeDTO(cmd.preferredTheme),
    facultyId: cmd.facultyId,
    programId: cmd.programId,
    programYearId: cmd.programYearId,
    groupCohortId: cmd.groupCohortId,
    semigroupCohortId: cmd.semigroupCohortId,
  };
}


function toRole(dto: UserRoleDTO): Role {
  return Role[dto as keyof typeof Role];
}

function toRoleFromAuth(dto: UserRoleDTO): Role {
  return Role[dto as keyof typeof Role];
}

function toLanguage(dto?: PreferredLanguageDTO | null): Language | null | undefined {
  if (dto === undefined) return undefined;
  if (dto === null) return null;

  switch (dto) {
    case PreferredLanguageDTO.EN:
      return Language.EN;
    case PreferredLanguageDTO.RO:
      return Language.RO;
    default:
      return undefined;
  }
}

function toLanguageFromAuth(dto?: PreferredLanguageDTO | null): Language | null | undefined {
  if (dto === undefined) return undefined;
  if (dto === null) return null;

  switch (dto) {
    case PreferredLanguageDTO.EN:
      return Language.EN;
    case PreferredLanguageDTO.RO:
      return Language.RO;
    default:
      return undefined;
  }
}

function toTheme(dto?: PreferredThemeDTO | null): Theme | null | undefined {
  if (dto === undefined) return undefined;
  if (dto === null) return null;
  return Theme[dto as keyof typeof Theme];
}

function toThemeFromAuth(dto?: PreferredThemeDTO | null): Theme | null | undefined {
  if (dto === undefined) return undefined;
  if (dto === null) return null;
  return Theme[dto as keyof typeof Theme];
}

function toRoleDTO(role: Role): UserRoleDTO;
function toRoleDTO(role: Role | undefined): UserRoleDTO | undefined;
function toRoleDTO(role: Role | undefined): UserRoleDTO | undefined {
  if (role === undefined) return undefined;
  return UserRoleDTO[role as keyof typeof UserRoleDTO];
}

function toLanguageDTO(language: Language | null | undefined): PreferredLanguageDTO | null | undefined {
  if (language === undefined) return undefined;
  if (language === null) return null;

  switch (language) {
    case Language.EN:
      return PreferredLanguageDTO.EN;
    case Language.RO:
      return PreferredLanguageDTO.RO;
    default:
      return undefined;
  }
}

function toThemeDTO(theme: Theme | null | undefined): PreferredThemeDTO | null | undefined {
  if (theme === undefined) return undefined;
  if (theme === null) return null;
  return PreferredThemeDTO[theme as keyof typeof PreferredThemeDTO];
}
