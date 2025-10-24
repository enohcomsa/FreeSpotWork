import { FloorBaseT, FloorResponseDto } from "../schemas/floors.zod";
import { FloorDbDoc, FloorDbRecord } from "../db/types/floors.db";
import { stripUndefined, toObjectId } from "../utils/mongo";

export function floorToDbRecord(input: FloorBaseT): FloorDbRecord {
  return {
    buildingId: toObjectId(input.buildingId),
    name: input.name,
    totalSpotsNumber: input.totalSpotsNumber,
    unavailableSpots: input.unavailableSpots,
  };
}

export function floorToDto(doc: FloorDbDoc): FloorResponseDto {
  return {
    id: doc._id.toHexString(),
    buildingId: doc.buildingId.toHexString(),
    name: doc.name,
    totalSpotsNumber: doc.totalSpotsNumber,
    unavailableSpots: doc.unavailableSpots,
  };
}

export function floorPatchToDbSet(patch: Partial<FloorBaseT>): Partial<FloorDbRecord> {
  const cleaned = stripUndefined(patch);
  const set: Partial<FloorDbRecord> = {};

  if (cleaned.buildingId !== undefined) set.buildingId = toObjectId(cleaned.buildingId);
  if (cleaned.name !== undefined) set.name = cleaned.name;
  if (cleaned.totalSpotsNumber !== undefined) set.totalSpotsNumber = cleaned.totalSpotsNumber;
  if (cleaned.unavailableSpots !== undefined) set.unavailableSpots = cleaned.unavailableSpots;

  return set;
}
