import {
  BuildingBaseT,
  BuildingCreateRequest,
  BuildingResponseDto,
  BuildingUpdateRequest,
} from "../schemas/buildings.zod";
import { getCollection, toObjectId, MongoDoc, mapToDto, MongoRecord, stripUndefined } from "../utils/mongo";

type BuildingDoc = MongoDoc<BuildingBaseT>;
type BuildingRecord = MongoRecord<BuildingBaseT>;
const BUILDINGS_COLLECTION = "buildings";

export async function listBuildings(): Promise<BuildingResponseDto[]> {
  const col = await getCollection<BuildingDoc>(BUILDINGS_COLLECTION);
  const docs = await col.find({}).sort({ name: 1 }).toArray();
  return docs.map((doc) => mapToDto<BuildingDoc, BuildingResponseDto>(doc));
}

export async function getBuildingById(id: string): Promise<BuildingResponseDto | null> {
  const col = await getCollection<BuildingDoc>(BUILDINGS_COLLECTION);
  const doc = await col.findOne({ _id: toObjectId(id) });
  return doc ? mapToDto<BuildingDoc, BuildingResponseDto>(doc) : null;
}

export async function createBuilding(input: BuildingCreateRequest): Promise<BuildingResponseDto> {
  const col = await getCollection<BuildingRecord>(BUILDINGS_COLLECTION);
  const { insertedId } = await col.insertOne(input);
  const doc: BuildingDoc = { _id: insertedId, ...input };
  return mapToDto<BuildingDoc, BuildingResponseDto>(doc);
}

export async function updateBuildingById(id: string, patch: BuildingUpdateRequest): Promise<BuildingResponseDto | null> {
  const col = await getCollection<BuildingDoc>(BUILDINGS_COLLECTION);
  const setPatch = stripUndefined(patch);
  const res = await col.findOneAndUpdate({ _id: toObjectId(id) }, { $set: setPatch }, { returnDocument: "after" });
  return res ? mapToDto<BuildingDoc, BuildingResponseDto>(res) : null;
}

export async function deleteBuildingById(id: string): Promise<boolean> {
  const col = await getCollection<BuildingDoc>(BUILDINGS_COLLECTION);
  const { deletedCount } = await col.deleteOne({ _id: toObjectId(id) });
  return deletedCount === 1;
}
