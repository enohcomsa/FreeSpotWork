import type { BookingBaseT, BookingResponseDto, BookingUpdateRequest } from "../schemas/bookings.zod";
import type { BookingDbDoc, BookingDbRecord } from "../db/types/bookings.db";
import { stripUndefined, toObjectId } from "../utils/mongo";

export function bookingToDbRecord(input: BookingBaseT, now = new Date()): BookingDbRecord {
  return {
    activityId: toObjectId(input.activityId),
    userId: toObjectId(input.userId),

    facultyId: input.facultyId == null ? null : toObjectId(input.facultyId),
    programId: input.programId == null ? null : toObjectId(input.programId),
    programYearId: input.programYearId == null ? null : toObjectId(input.programYearId),
    groupCohortId: input.groupCohortId == null ? null : toObjectId(input.groupCohortId),
    semigroupCohortId: input.semigroupCohortId == null ? null : toObjectId(input.semigroupCohortId),

    subjectId: input.subjectId == null ? null : toObjectId(input.subjectId),
    activityType: input.activityType,

    status: input.status,

    originalActivityId: input.originalActivityId == null ? null : toObjectId(input.originalActivityId),
    isRescheduled: input.isRescheduled ?? null,
    rescheduledAt: input.rescheduledAt == null ? null : new Date(input.rescheduledAt),

    createdAt: now,
    updatedAt: null,
  };
}

export function bookingToDto(doc: BookingDbDoc): BookingResponseDto {
  return {
    id: doc._id.toHexString(),
    activityId: doc.activityId.toHexString(),
    userId: doc.userId.toHexString(),

    facultyId: doc.facultyId == null ? null : doc.facultyId.toHexString(),
    programId: doc.programId == null ? null : doc.programId.toHexString(),
    programYearId: doc.programYearId == null ? null : doc.programYearId.toHexString(),
    groupCohortId: doc.groupCohortId == null ? null : doc.groupCohortId.toHexString(),
    semigroupCohortId: doc.semigroupCohortId == null ? null : doc.semigroupCohortId.toHexString(),

    subjectId: doc.subjectId == null ? null : doc.subjectId.toHexString(),
    activityType: doc.activityType,

    status: doc.status,

    originalActivityId: doc.originalActivityId == null ? null : doc.originalActivityId.toHexString(),
    isRescheduled: doc.isRescheduled ?? null,
    rescheduledAt: doc.rescheduledAt == null ? null : doc.rescheduledAt.toISOString(),

    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt == null ? null : doc.updatedAt.toISOString(),
  };
}

export function bookingPatchToDbSet(
  patch: BookingUpdateRequest,
  now = new Date()
): Partial<BookingDbRecord> {
  const cleaned = stripUndefined(patch);
  const set: Partial<BookingDbRecord> = {};

  if (cleaned.activityId !== undefined) {
    set.activityId = toObjectId(cleaned.activityId);
  }

  if (cleaned.userId !== undefined) {
    set.userId = toObjectId(cleaned.userId);
  }

  if (cleaned.facultyId !== undefined) {
    set.facultyId = cleaned.facultyId === null ? null : toObjectId(cleaned.facultyId);
  }

  if (cleaned.programId !== undefined) {
    set.programId = cleaned.programId === null ? null : toObjectId(cleaned.programId);
  }

  if (cleaned.programYearId !== undefined) {
    set.programYearId = cleaned.programYearId === null ? null : toObjectId(cleaned.programYearId);
  }

  if (cleaned.groupCohortId !== undefined) {
    set.groupCohortId = cleaned.groupCohortId === null ? null : toObjectId(cleaned.groupCohortId);
  }

  if (cleaned.semigroupCohortId !== undefined) {
    set.semigroupCohortId =
      cleaned.semigroupCohortId === null ? null : toObjectId(cleaned.semigroupCohortId);
  }

  if (cleaned.subjectId !== undefined) {
    set.subjectId = cleaned.subjectId === null ? null : toObjectId(cleaned.subjectId);
  }

  if (cleaned.activityType !== undefined) {
    set.activityType = cleaned.activityType;
  }

  if (cleaned.status !== undefined) {
    set.status = cleaned.status;
  }

  if (cleaned.originalActivityId !== undefined) {
    set.originalActivityId =
      cleaned.originalActivityId === null ? null : toObjectId(cleaned.originalActivityId);
  }

  if (cleaned.isRescheduled !== undefined) {
    set.isRescheduled = cleaned.isRescheduled;
  }

  if (cleaned.rescheduledAt !== undefined) {
    set.rescheduledAt = cleaned.rescheduledAt === null ? null : new Date(cleaned.rescheduledAt);
  }

  if (Object.keys(set).length > 0) {
    set.updatedAt = now;
  }

  return set;
}
