import type { RoomBaseT, RoomUpdateRequest, RoomResponseDto } from "../schemas/rooms.zod";
import type { RoomDbDoc, RoomDbRecord } from "../db/types/rooms.db";
import { stripUndefined, toObjectId } from "../utils/mongo";

export function roomToDbRecord(input: RoomBaseT): RoomDbRecord {
  return {
    buildingId: toObjectId(input.buildingId),
    floorId: toObjectId(input.floorId),
    name: input.name,
    totalSpotsNumber: input.totalSpotsNumber,
    unavailableSpots: input.unavailableSpots,
    subjectList: input.subjectList.map((id) => toObjectId(id)),
  };
}

export function roomToDto(doc: RoomDbDoc): RoomResponseDto {
  return {
    id: doc._id.toHexString(),
    buildingId: doc.buildingId.toHexString(),
    floorId: doc.floorId.toHexString(),
    name: doc.name,
    totalSpotsNumber: doc.totalSpotsNumber,
    unavailableSpots: doc.unavailableSpots,
    subjectList: doc.subjectList.map((id) => id.toHexString()),
  };
}

export function roomPatchToDbSet(patch: RoomUpdateRequest): Partial<RoomDbRecord> {
  const cleaned = stripUndefined(patch);
  const set: Partial<RoomDbRecord> = {};

  if (cleaned.buildingId !== undefined) set.buildingId = toObjectId(cleaned.buildingId);
  if (cleaned.floorId !== undefined) set.floorId = toObjectId(cleaned.floorId);
  if (cleaned.name !== undefined) set.name = cleaned.name;
  if (cleaned.totalSpotsNumber !== undefined) set.totalSpotsNumber = cleaned.totalSpotsNumber;
  if (cleaned.unavailableSpots !== undefined) set.unavailableSpots = cleaned.unavailableSpots;
  if (cleaned.subjectList !== undefined) set.subjectList = cleaned.subjectList.map(toObjectId);

  return set;
}
