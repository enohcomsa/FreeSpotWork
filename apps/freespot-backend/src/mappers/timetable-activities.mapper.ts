import type {
  TimetableActivityBaseT,
  TimetableActivityUpdateRequest,
  TimetableActivityResponseDto,
} from "../schemas/timetable-activities.zod";
import type {
  TimetableActivityDbDoc,
  TimetableActivityDbRecord,
} from "../db/types/timetable-activities.db";
import { stripUndefined, toObjectId } from "../utils/mongo";

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
  const cleaned = stripUndefined(patch);
  const set: Partial<TimetableActivityDbRecord> = {};

  if (cleaned.roomId !== undefined) set.roomId = toObjectId(cleaned.roomId);
  if (cleaned.subjectId !== undefined) set.subjectId = toObjectId(cleaned.subjectId);
  if (cleaned.date !== undefined) set.date = cleaned.date;
  if (cleaned.weekDay !== undefined) set.weekDay = cleaned.weekDay;
  if (cleaned.activityType !== undefined) set.activityType = cleaned.activityType;
  if (cleaned.cohortIds !== undefined) set.cohortIds = cleaned.cohortIds.map((id) => toObjectId(id));
  if (cleaned.startHour !== undefined) set.startHour = cleaned.startHour;
  if (cleaned.endHour !== undefined) set.endHour = cleaned.endHour;
  if (cleaned.weekParity !== undefined) set.weekParity = cleaned.weekParity;
  if (cleaned.capacity !== undefined) set.capacity = cleaned.capacity;
  if (cleaned.reservedSpots !== undefined) set.reservedSpots = cleaned.reservedSpots;
  if (cleaned.busySpots !== undefined) set.busySpots = cleaned.busySpots;
  if (cleaned.freeSpots !== undefined) set.freeSpots = cleaned.freeSpots;

  return set;
}

