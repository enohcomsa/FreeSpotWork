import { BuildingDbDoc, BuildingDbRecord } from "../db/types";
import { buildingPatchToDbSet, buildingToDbRecord, buildingToDto } from "../mappers";
import { BuildingCreateRequest, BuildingResponseDto, BuildingUpdateRequest } from "../schemas/buildings.zod";
import { getCollection, isEmptySet, toObjectId } from "../utils/mongo";

const BUILDINGS_COLLECTION = "buildings";

export async function listBuildings(): Promise<BuildingResponseDto[]> {
  const collection = await getCollection<BuildingDbDoc>(BUILDINGS_COLLECTION);
  const docs = await collection.find({}).sort({ name: 1 }).toArray();
  return docs.map(buildingToDto);
}

export async function getBuildingById(id: string): Promise<BuildingResponseDto | null> {
  const collection = await getCollection<BuildingDbDoc>(BUILDINGS_COLLECTION);
  const doc = await collection.findOne({ _id: toObjectId(id) });
  return doc ? buildingToDto(doc) : null;
}

export async function createBuilding(input: BuildingCreateRequest): Promise<BuildingResponseDto> {
  const collection = await getCollection<BuildingDbRecord>(BUILDINGS_COLLECTION);
  const record = buildingToDbRecord(input);
  const result = await collection.insertOne(record);
  return buildingToDto({ _id: result.insertedId, ...record });
}

export async function updateBuildingById(id: string, patch: BuildingUpdateRequest): Promise<BuildingResponseDto | null> {
  const collection = await getCollection<BuildingDbDoc>(BUILDINGS_COLLECTION);
  const updateSet = buildingPatchToDbSet(patch);
  if (isEmptySet(updateSet)) {
    const current = await collection.findOne({ _id: toObjectId(id) });
    return current ? buildingToDto(current) : null;
  }
  const updated = await collection.findOneAndUpdate({ _id: toObjectId(id) }, { $set: updateSet }, { returnDocument: "after" });
  return updated ? buildingToDto(updated) : null;
}

export async function deleteBuildingById(id: string): Promise<boolean> {
  const collection = await getCollection<BuildingDbDoc>(BUILDINGS_COLLECTION);
  const { deletedCount } = await collection.deleteOne({ _id: toObjectId(id) });
  return deletedCount === 1;
}
