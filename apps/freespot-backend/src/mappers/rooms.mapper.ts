import type { RoomBaseT, RoomUpdateRequest, RoomResponseDto } from "../schemas/rooms.zod";
import type { RoomDbDoc, RoomDbRecord } from "../db/types/rooms.db";
import { toObjectId } from "../utils/mongo";

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
  const set: Partial<RoomDbRecord> = {};
  if (Object.prototype.hasOwnProperty.call(patch, "buildingId") && patch.buildingId !== undefined) {
    set.buildingId = toObjectId(patch.buildingId);
  }
  if (Object.prototype.hasOwnProperty.call(patch, "floorId") && patch.floorId !== undefined) {
    set.floorId = toObjectId(patch.floorId);
  }
  if (Object.prototype.hasOwnProperty.call(patch, "name") && patch.name !== undefined) {
    set.name = patch.name;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "totalSpotsNumber") && patch.totalSpotsNumber !== undefined) {
    set.totalSpotsNumber = patch.totalSpotsNumber;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "unavailableSpots") && patch.unavailableSpots !== undefined) {
    set.unavailableSpots = patch.unavailableSpots;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "subjectList") && patch.subjectList !== undefined) {
    set.subjectList = patch.subjectList.map((id) => toObjectId(id));
  }
  return set;
}
