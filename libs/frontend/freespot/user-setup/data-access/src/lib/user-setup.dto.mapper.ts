import { AuthUserDTO, UserMeProfileUpdateDTO } from '@free-spot/api-client';
import { type User } from '@free-spot/core/domain';
import { type UpdateMyProfileCmd } from '@free-spot/user-setup/domain';

export function authUserDtoToUser(dto: AuthUserDTO): User {
  return {
    id: dto.id,
    email: dto.email,
    firstName: dto.firstName,
    familyName: dto.familyName,
    role: dto.role as any,
    preferredLanguage: dto.preferredLanguage as any,
    preferredTheme: dto.preferredTheme as any,
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
