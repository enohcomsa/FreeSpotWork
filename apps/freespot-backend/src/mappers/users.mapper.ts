import type { UserBaseT, UserUpdateRequest, UserResponseDto } from "../schemas/users.zod";
import type { UserDbDoc, UserDbRecord } from "../db/types/users.db";
import { toObjectId } from "../utils/mongo";

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
  const set: Partial<UserDbRecord> = {};
  if (Object.prototype.hasOwnProperty.call(patch, "firstName") && patch.firstName !== undefined) set.firstName = patch.firstName;
  if (Object.prototype.hasOwnProperty.call(patch, "familyName") && patch.familyName !== undefined) set.familyName = patch.familyName;
  if (Object.prototype.hasOwnProperty.call(patch, "role") && patch.role !== undefined) set.role = patch.role;
  if (Object.prototype.hasOwnProperty.call(patch, "preferredLanguage")) set.preferredLanguage = patch.preferredLanguage ?? null;
  if (Object.prototype.hasOwnProperty.call(patch, "preferredTheme")) set.preferredTheme = patch.preferredTheme ?? null;
  if (Object.prototype.hasOwnProperty.call(patch, "facultyId") && patch.facultyId !== undefined) set.facultyId = toObjectId(patch.facultyId);
  if (Object.prototype.hasOwnProperty.call(patch, "programYearId") && patch.programYearId !== undefined) set.programYearId = toObjectId(patch.programYearId);
  if (Object.prototype.hasOwnProperty.call(patch, "groupCohortId") && patch.groupCohortId !== undefined) set.groupCohortId = toObjectId(patch.groupCohortId);
  if (Object.prototype.hasOwnProperty.call(patch, "semigroupCohortId")) {
    const sg = patch.semigroupCohortId as string | null | undefined;
    set.semigroupCohortId = sg == null ? null : toObjectId(sg);
  }
  return set;
}
