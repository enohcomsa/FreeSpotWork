import type { UserBaseT, UserUpdateRequest, UserResponseDto } from "../schemas/users.zod";
import type { UserDbDoc, UserDbRecord } from "../db/types/users.db";
import { stripUndefined, toObjectId } from "../utils/mongo";
import { SignupRequestT } from "../schemas/auth.zod";


export function signupToDbRecord(input: SignupRequestT, passwordHash: string): UserDbRecord {
  const now = new Date();

  return {
    email: input.email.trim().toLowerCase(),
    username: input.username ? input.username.trim().toLowerCase() : null,

    firstName: null,
    familyName: null,

    role: "MEMBER",

    preferredLanguage: null,
    preferredTheme: null,

    facultyId: null,
    programYearId: null,
    groupCohortId: null,
    semigroupCohortId: null,

    emailVerified: false,
    auth: { local: { hash: passwordHash } },
    security: { tokenVersion: 0 },

    createdAt: now,
    updatedAt: now,
  };
}

export function userToDbRecord(input: UserBaseT): UserDbRecord {
  const now = new Date();

  return {
    email: input.email.trim().toLowerCase(),
    username: input.username ? input.username.trim().toLowerCase() : null,
    firstName: input.firstName.trim(),
    familyName: input.familyName.trim(),
    role: input.role,


    preferredLanguage: input.preferredLanguage ?? null,
    preferredTheme: input.preferredTheme ?? null,

    facultyId: toObjectId(input.facultyId),
    programYearId: toObjectId(input.programYearId),
    groupCohortId: toObjectId(input.groupCohortId),
    semigroupCohortId: input.semigroupCohortId === null ? null : toObjectId(input.semigroupCohortId),

    emailVerified: false,
    auth: {},
    security: { tokenVersion: 0 },

    createdAt: now,
    updatedAt: now,
  };
}

export function userToDto(doc: UserDbDoc): UserResponseDto {
  return {
    id: doc._id.toHexString(),
    email: doc.email,
    username: doc.username ?? null,
    firstName: doc.firstName,
    familyName: doc.familyName,
    role: doc.role,

    preferredLanguage: doc.preferredLanguage ?? null,
    preferredTheme: doc.preferredTheme ?? null,

    facultyId: doc.facultyId == null ? null : doc.facultyId.toHexString(),
    programYearId: doc.programYearId == null ? null : doc.programYearId.toHexString(),
    groupCohortId: doc.groupCohortId == null ? null : doc.groupCohortId.toHexString(),
    semigroupCohortId: doc.semigroupCohortId == null ? null : doc.semigroupCohortId.toHexString(),
  };
}

export function userPatchToDbSet(patch: UserUpdateRequest): Partial<UserDbRecord> {
  const cleaned = stripUndefined(patch);
  const set: Partial<UserDbRecord> = {};

  if (cleaned.firstName !== undefined) set.firstName = cleaned.firstName.trim();
  if (cleaned.familyName !== undefined) set.familyName = cleaned.familyName.trim();
  if (cleaned.role !== undefined) set.role = cleaned.role;

  if (cleaned.preferredLanguage !== undefined) set.preferredLanguage = cleaned.preferredLanguage ?? null;
  if (cleaned.preferredTheme !== undefined) set.preferredTheme = cleaned.preferredTheme ?? null;

  if (cleaned.facultyId !== undefined) set.facultyId = toObjectId(cleaned.facultyId);
  if (cleaned.programYearId !== undefined) set.programYearId = toObjectId(cleaned.programYearId);
  if (cleaned.groupCohortId !== undefined) set.groupCohortId = toObjectId(cleaned.groupCohortId);

  if (cleaned.semigroupCohortId !== undefined) {
    set.semigroupCohortId = cleaned.semigroupCohortId === null ? null : toObjectId(cleaned.semigroupCohortId);
  }

  if ((cleaned).username !== undefined) {
    const u = (cleaned).username;
    set.username = u == null ? null : String(u).trim().toLowerCase();
  }

  if (Object.keys(set).length > 0) {
    set.updatedAt = new Date();
  }

  return set;
}
