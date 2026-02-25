import { FloorDbDoc, FloorDbRecord } from "../db/types";
import { floorPatchToDbSet, floorToDbRecord, floorToDto } from "../mappers";
import { FloorCreateRequest, FloorResponseDto, FloorUpdateRequest } from "../schemas/floors.zod";
import { getCollection, isEmptySet, toObjectId } from "../utils/mongo";

const FLOORS_COLLECTION = "floors";

export async function listFloors(): Promise<FloorResponseDto[]> {
  const collection = await getCollection<FloorDbDoc>(FLOORS_COLLECTION);
  const docs = await collection.find({}).sort({ name: 1 }).toArray();
  return docs.map(floorToDto);
}

export async function getFloorById(id: string): Promise<FloorResponseDto | null> {
  const collection = await getCollection<FloorDbDoc>(FLOORS_COLLECTION);
  const doc = await collection.findOne({ _id: toObjectId(id) });
  return doc ? floorToDto(doc) : null;
}

export async function createFloor(input: FloorCreateRequest): Promise<FloorResponseDto> {
  const collection = await getCollection<FloorDbRecord>(FLOORS_COLLECTION);
  const record = floorToDbRecord(input);
  const result = await collection.insertOne(record);
  return floorToDto({ _id: result.insertedId, ...record });
}

export async function updateFloorById(id: string, patch: FloorUpdateRequest): Promise<FloorResponseDto | null> {
  const collection = await getCollection<FloorDbDoc>(FLOORS_COLLECTION);
  const updateSet = floorPatchToDbSet(patch);
  if (isEmptySet(updateSet)) {
    const current = await collection.findOne({ _id: toObjectId(id) });
    return current ? floorToDto(current) : null;
  }
  const updated = await collection.findOneAndUpdate({ _id: toObjectId(id) }, { $set: updateSet }, { returnDocument: "after" });
  return updated ? floorToDto(updated) : null;
}

export async function deleteFloorById(id: string): Promise<boolean> {
  const collection = await getCollection<FloorDbDoc>(FLOORS_COLLECTION);
  const { deletedCount } = await collection.deleteOne({ _id: toObjectId(id) });
  return deletedCount === 1;
}
