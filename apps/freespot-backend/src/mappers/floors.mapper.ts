import { FloorBaseT, FloorResponseDto } from "../schemas/floors.zod";
import { FloorDbDoc, FloorDbRecord } from "../db/types/floors.db";
import { toObjectId } from "../utils/mongo";

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
