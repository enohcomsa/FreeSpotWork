import type { BuildingBaseT, BuildingResponseDto } from "../schemas/buildings.zod";
import type { BuildingDbDoc, BuildingDbRecord } from "../db/types/buildings.db";

export function buildingToDbRecord(input: BuildingBaseT): BuildingDbRecord {
  return {
    name: input.name,
    address: input.address,
    specialEvent: input.specialEvent,
  };
}

export function buildingToDto(doc: BuildingDbDoc): BuildingResponseDto {
  return {
    id: doc._id.toHexString(),
    name: doc.name,
    address: doc.address,
    specialEvent: doc.specialEvent,
  };
}

export function buildingPatchToDbSet(patch: Partial<BuildingBaseT>): Partial<BuildingDbRecord> {
  const set: Partial<BuildingDbRecord> = {};
  if (Object.prototype.hasOwnProperty.call(patch, "name") && patch.name !== undefined) set.name = patch.name;
  if (Object.prototype.hasOwnProperty.call(patch, "address") && patch.address !== undefined) set.address = patch.address;
  if (Object.prototype.hasOwnProperty.call(patch, "specialEvent") && patch.specialEvent !== undefined) set.specialEvent = patch.specialEvent;
  return set;
}
