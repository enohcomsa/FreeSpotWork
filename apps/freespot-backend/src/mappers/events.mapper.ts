import type { EventBaseT, EventResponseDto } from "../schemas/events.zod";
import type { EventDbDoc, EventDbRecord } from "../db/types/events.db";
import { stripUndefined, toObjectId } from "../utils/mongo";

export function eventToDbRecord(input: EventBaseT): EventDbRecord {
  return {
    type: input.type,
    name: input.name,
    date: input.date instanceof Date ? input.date : new Date(input.date),
    startHour: input.startHour,
    buildingId: toObjectId(input.buildingId),
    roomId: toObjectId(input.roomId),
    reservedSpots: input.reservedSpots,
  };
}

export function eventToDto(doc: EventDbDoc): EventResponseDto {
  return {
    id: doc._id.toHexString(),
    type: doc.type,
    name: doc.name,
    date: doc.date.toISOString(),
    startHour: doc.startHour,
    buildingId: doc.buildingId.toHexString(),
    roomId: doc.roomId.toHexString(),
    reservedSpots: doc.reservedSpots,
  };
}

export function eventPatchToDbSet(patch: Partial<EventBaseT>): Partial<EventDbRecord> {
  const cleaned = stripUndefined(patch);
  const set: Partial<EventDbRecord> = {};

  if (cleaned.type !== undefined) set.type = cleaned.type;
  if (cleaned.name !== undefined) set.name = cleaned.name;
  if (cleaned.date !== undefined) set.date = cleaned.date instanceof Date ? cleaned.date : new Date(cleaned.date);
  if (cleaned.startHour !== undefined) set.startHour = cleaned.startHour;
  if (cleaned.buildingId !== undefined) set.buildingId = toObjectId(cleaned.buildingId);
  if (cleaned.roomId !== undefined) set.roomId = toObjectId(cleaned.roomId);
  if (cleaned.reservedSpots !== undefined) set.reservedSpots = cleaned.reservedSpots;

  return set;
}
