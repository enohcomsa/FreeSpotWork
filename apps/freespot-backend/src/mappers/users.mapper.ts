import type { UserBaseT, UserUpdateRequest, UserResponseDto } from "../schemas/users.zod";
import type { UserDbDoc, UserDbRecord } from "../db/types/users.db";
import { stripUndefined, toObjectId } from "../utils/mongo";

export function userToDbRecord(input: UserBaseT): UserDbRecord {
  return {
    email: input.email,
    firstName: input.firstName,
    familyName: input.familyName,
    role: input.role,
    preferredLanguage: input.preferredLanguage ?? null,
    preferredTheme: input.preferredTheme ?? null,
    facultyId: toObjectId(input.facultyId),
    programYearId: toObjectId(input.programYearId),
    groupCohortId: toObjectId(input.groupCohortId),
    semigroupCohortId: input.semigroupCohortId == null ? null : toObjectId(input.semigroupCohortId),
  };
}

export function userToDto(doc: UserDbDoc): UserResponseDto {
  return {
    id: doc._id.toHexString(),
    email: doc.email,
    firstName: doc.firstName,
    familyName: doc.familyName,
    role: doc.role,
    preferredLanguage: doc.preferredLanguage ?? null,
    preferredTheme: doc.preferredTheme ?? null,
    facultyId: doc.facultyId.toHexString(),
    programYearId: doc.programYearId.toHexString(),
    groupCohortId: doc.groupCohortId.toHexString(),
    semigroupCohortId: doc.semigroupCohortId == null ? null : doc.semigroupCohortId.toHexString(),
  };
}

export function userPatchToDbSet(patch: UserUpdateRequest): Partial<UserDbRecord> {
  const cleaned = stripUndefined(patch);
  const set: Partial<UserDbRecord> = {};

  if (cleaned.firstName !== undefined) set.firstName = cleaned.firstName;
  if (cleaned.familyName !== undefined) set.familyName = cleaned.familyName;
  if (cleaned.role !== undefined) set.role = cleaned.role;
  if (cleaned.preferredLanguage !== undefined) set.preferredLanguage = cleaned.preferredLanguage ?? null;
  if (cleaned.preferredTheme !== undefined) set.preferredTheme = cleaned.preferredTheme ?? null;
  if (cleaned.facultyId !== undefined) set.facultyId = toObjectId(cleaned.facultyId);
  if (cleaned.programYearId !== undefined) set.programYearId = toObjectId(cleaned.programYearId);
  if (cleaned.groupCohortId !== undefined) set.groupCohortId = toObjectId(cleaned.groupCohortId);
  if (cleaned.semigroupCohortId !== undefined)
    set.semigroupCohortId = cleaned.semigroupCohortId === null ? null : toObjectId(cleaned.semigroupCohortId);

  return set;
}
