import type {
  TimetableActivityBaseT,
  TimetableActivityUpdateRequest,
  TimetableActivityResponseDto,
} from "../schemas/timetable-activities.zod";
import type {
  TimetableActivityDbDoc,
  TimetableActivityDbRecord,
} from "../db/types/timetable-activities.db";
import { toObjectId } from "../utils/mongo";

export function timetableActivityToDbRecord(input: TimetableActivityBaseT): TimetableActivityDbRecord {
  return {
    roomId: toObjectId(input.roomId),
    subjectId: toObjectId(input.subjectId),
    date: input.date,
    weekDay: input.weekDay,
    activityType: input.activityType,
    cohortIds: input.cohortIds.map((id) => toObjectId(id)),
    startHour: input.startHour,
    endHour: input.endHour,
    weekParity: input.weekParity,
    capacity: input.capacity,
    reservedSpots: input.reservedSpots,
    busySpots: input.busySpots,
    freeSpots: input.freeSpots,
  };
}

export function timetableActivityToDto(doc: TimetableActivityDbDoc): TimetableActivityResponseDto {
  return {
    id: doc._id.toHexString(),
    roomId: doc.roomId.toHexString(),
    subjectId: doc.subjectId.toHexString(),
    date: doc.date,
    weekDay: doc.weekDay,
    activityType: doc.activityType,
    cohortIds: doc.cohortIds.map((id) => id.toHexString()),
    startHour: doc.startHour,
    endHour: doc.endHour,
    weekParity: doc.weekParity,
    capacity: doc.capacity,
    reservedSpots: doc.reservedSpots,
    busySpots: doc.busySpots,
    freeSpots: doc.freeSpots,
  };
}

export function timetableActivityPatchToDbSet(patch: TimetableActivityUpdateRequest): Partial<TimetableActivityDbRecord> {
  const set: Partial<TimetableActivityDbRecord> = {};
  if (Object.prototype.hasOwnProperty.call(patch, "roomId") && patch.roomId !== undefined) {
    set.roomId = toObjectId(patch.roomId);
  }
  if (Object.prototype.hasOwnProperty.call(patch, "subjectId") && patch.subjectId !== undefined) {
    set.subjectId = toObjectId(patch.subjectId);
  }
  if (Object.prototype.hasOwnProperty.call(patch, "date") && patch.date !== undefined) {
    set.date = patch.date;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "weekDay") && patch.weekDay !== undefined) {
    set.weekDay = patch.weekDay;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "activityType") && patch.activityType !== undefined) {
    set.activityType = patch.activityType;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "cohortIds") && patch.cohortIds !== undefined) {
    set.cohortIds = patch.cohortIds.map((id) => toObjectId(id));
  }
  if (Object.prototype.hasOwnProperty.call(patch, "startHour") && patch.startHour !== undefined) {
    set.startHour = patch.startHour;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "endHour") && patch.endHour !== undefined) {
    set.endHour = patch.endHour;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "weekParity") && patch.weekParity !== undefined) {
    set.weekParity = patch.weekParity;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "capacity") && patch.capacity !== undefined) {
    set.capacity = patch.capacity;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "reservedSpots") && patch.reservedSpots !== undefined) {
    set.reservedSpots = patch.reservedSpots;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "busySpots") && patch.busySpots !== undefined) {
    set.busySpots = patch.busySpots;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "freeSpots") && patch.freeSpots !== undefined) {
    set.freeSpots = patch.freeSpots;
  }
  return set;
}
