import type { BookingBaseT, BookingResponseDto } from "../schemas/bookings.zod";
import type { BookingStatusT } from "../schemas/common.zod";
import type { BookingDbDoc, BookingDbRecord } from "../db/types/bookings.db";
import { stripUndefined, toObjectId } from "../utils/mongo";

export function bookingToDbRecord(input: BookingBaseT, now = new Date()): BookingDbRecord {
  return {
    activityId: toObjectId(input.activityId),
    userId: toObjectId(input.userId),
    cohortId: input.cohortId == null ? null : toObjectId(input.cohortId),
    status: input.status,
    createdAt: now,
    updatedAt: null,
    source:
      input.source == null ? null : ({
        type: input.source.type,
        id: toObjectId(input.source.id),
      } as const),
  };
}

export function bookingToDto(doc: BookingDbDoc): BookingResponseDto {
  return {
    id: doc._id.toHexString(),
    activityId: doc.activityId.toHexString(),
    userId: doc.userId.toHexString(),
    cohortId: doc.cohortId == null ? null : doc.cohortId.toHexString(),
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt == null ? null : doc.updatedAt.toISOString(),
    source: doc.source == null ? null : ({
      type: doc.source.type,
      id: doc.source.id.toHexString(),
    } as const),
  };
}

export function bookingPatchToDbSet(patch: Partial<BookingBaseT> & { status?: BookingStatusT }, now = new Date()): Partial<BookingDbRecord> {
  const cleaned = stripUndefined(patch);
  const set: Partial<BookingDbRecord> = {};

  if (cleaned.activityId !== undefined) set.activityId = toObjectId(cleaned.activityId);
  if (cleaned.userId !== undefined) set.userId = toObjectId(cleaned.userId);
  if (cleaned.cohortId !== undefined) set.cohortId = cleaned.cohortId === null ? null : toObjectId(cleaned.cohortId);
  if (cleaned.status !== undefined) set.status = cleaned.status;
  if (cleaned.source !== undefined) {
    set.source = cleaned.source === null ? null : { type: cleaned.source.type, id: toObjectId(cleaned.source.id) };
  }
  if (Object.keys(set).length > 0) set.updatedAt = now;

  return set;
}
