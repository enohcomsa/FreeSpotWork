import { Language, Theme, type UpdateMyPreferencesCmd, type UpdateUserCmd, type User } from '@free-spot/core/domain';
import { AuthUserDTO, UserResponseDTO, UserMeProfileUpdateDTO, UserMePreferencesUpdateDTO, UserUpdateDTO } from "@free-spot/api-client";
import { dtoToRole, roleToDto } from "./role.dto.mapper";
import { dtoToLanguage, languageToDto } from "./language.dto.mapper";
import { dtoToTheme, themeToDto } from "./theme.dto.mapper";
import { type UpdateMyProfileCmd } from '@free-spot/user-setup/domain';

export function authDtoToDomain(dto: AuthUserDTO): User {
  return {
    id: dto.id,
    email: dto.email,
    firstName: dto.firstName,
    familyName: dto.familyName,
    role: dtoToRole(dto.role),
    preferredLanguage: dto.preferredLanguage ? dtoToLanguage(dto.preferredLanguage) : Language.EN,
    preferredTheme: dto.preferredTheme ? dtoToTheme(dto.preferredTheme) : Theme.LIGHT,
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
    role: dtoToRole(dto.role),
    preferredLanguage: dto.preferredLanguage ? dtoToLanguage(dto.preferredLanguage) : Language.EN,
    preferredTheme: dto.preferredTheme ? dtoToTheme(dto.preferredTheme) : Theme.LIGHT,
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
    preferredLanguage: cmd.preferredLanguage ? languageToDto(cmd.preferredLanguage) : undefined,
    preferredTheme: cmd.preferredTheme ? themeToDto(cmd.preferredTheme) : undefined,
  };
}

export function toUpdateUserDTO(cmd: UpdateUserCmd): UserUpdateDTO {
  return {
    username: cmd.username,
    firstName: cmd.firstName,
    familyName: cmd.familyName,
    role: cmd.role ? roleToDto(cmd.role) : undefined,
    preferredLanguage: cmd.preferredLanguage ? languageToDto(cmd.preferredLanguage) : undefined,
    preferredTheme: cmd.preferredTheme ? themeToDto(cmd.preferredTheme) : undefined,
    facultyId: cmd.facultyId,
    programId: cmd.programId,
    programYearId: cmd.programYearId,
    groupCohortId: cmd.groupCohortId,
    semigroupCohortId: cmd.semigroupCohortId,
  };
}
