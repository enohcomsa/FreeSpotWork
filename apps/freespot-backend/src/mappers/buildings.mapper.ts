import type { BuildingBaseT, BuildingResponseDto } from "../schemas/buildings.zod";
import type { BuildingDbDoc, BuildingDbRecord } from "../db/types/buildings.db";
import { stripUndefined } from "../utils/mongo";

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
  const cleaned = stripUndefined(patch);
  const set: Partial<BuildingDbRecord> = {};

  if (cleaned.name !== undefined) set.name = cleaned.name;
  if (cleaned.address !== undefined) set.address = cleaned.address;
  if (cleaned.specialEvent !== undefined) set.specialEvent = cleaned.specialEvent;

  return set;
}
