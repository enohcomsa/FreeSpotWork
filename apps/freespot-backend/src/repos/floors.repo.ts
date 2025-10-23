import {
  FloorBaseT,
  FloorCreateRequest,
  FloorUpdateRequest,
  FloorResponseDto,
} from "../schemas/floors.zod";
import { getCollection, toObjectId, MongoDoc, mapToDto, MongoRecord, stripUndefined } from "../utils/mongo";

type FloorDoc = MongoDoc<FloorBaseT>;
type FloorRecord = MongoRecord<FloorBaseT>;
const FLOOR_COLLECTION = 'floors';

export async function listFloors(): Promise<FloorResponseDto[]> {
  const col = await getCollection<FloorDoc>(FLOOR_COLLECTION);
  const docs = await col.find({}).sort({ name: 1 }).toArray();
  return docs.map((doc) => mapToDto<FloorDoc, FloorResponseDto>(doc));
}

export async function getFloorById(id: string): Promise<FloorResponseDto | null> {
  const col = await getCollection<FloorDoc>(FLOOR_COLLECTION);
  const doc = await col.findOne({ _id: toObjectId(id) });
  return doc ? mapToDto<FloorDoc, FloorResponseDto>(doc) : null;
}

export async function createFloor(input: FloorCreateRequest): Promise<FloorResponseDto> {
  const col = await getCollection<FloorRecord>(FLOOR_COLLECTION);
    const doc1 = {
      ...input,
    buildingId:toObjectId(input.buildingId),

  };
  const { insertedId } = await col.insertOne(doc1);
  const doc: FloorDoc = { _id: insertedId, ...input };
  return mapToDto<FloorDoc, FloorResponseDto>(doc);
}

export async function updateFloorById(id: string, patch: FloorUpdateRequest): Promise<FloorResponseDto | null> {
  const col = await getCollection<FloorDoc>(FLOOR_COLLECTION);
  const setPatch = stripUndefined(patch);
  const res = await col.findOneAndUpdate({ _id: toObjectId(id) }, { $set: setPatch }, { returnDocument: "after" });
  return res ? mapToDto<FloorDoc, FloorResponseDto>(res) : null;
}

export async function deleteFloorById(id: string): Promise<boolean> {
  const col = await getCollection<FloorRecord>(FLOOR_COLLECTION);
  const { deletedCount } = await col.deleteOne({ _id: toObjectId(id) });
  return deletedCount === 1;
}
