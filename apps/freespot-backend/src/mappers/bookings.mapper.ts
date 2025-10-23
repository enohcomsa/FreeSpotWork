import type { BookingBaseT, BookingResponseDto } from "../schemas/bookings.zod";
import type { SourceT, BookingStatusT } from "../schemas/common.zod";
import type { BookingDbDoc, BookingDbRecord } from "../db/types/bookings.db";
import { toObjectId } from "../utils/mongo";

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
  const set: Partial<BookingDbRecord> = {};

  if (Object.prototype.hasOwnProperty.call(patch, "activityId")) {
    if (patch.activityId !== undefined) set.activityId = toObjectId(patch.activityId);
  }

  if (Object.prototype.hasOwnProperty.call(patch, "userId")) {
    if (patch.userId !== undefined) set.userId = toObjectId(patch.userId);
  }

  if (Object.prototype.hasOwnProperty.call(patch, "cohortId")) {
    set.cohortId = patch.cohortId == null ? null : toObjectId(patch.cohortId);
  }

  if (Object.prototype.hasOwnProperty.call(patch, "status")) {
    if (patch.status !== undefined) set.status = patch.status;
  }

  if (Object.prototype.hasOwnProperty.call(patch, "source")) {
    const s: SourceT = patch.source;
    if (s === null) {
      set.source = null;
    } else if (s !== undefined) {
      set.source = { type: s.type, id: toObjectId(s.id) };
    }
  }

  if (Object.keys(set).length > 0) set.updatedAt = now;

  return set;
}
