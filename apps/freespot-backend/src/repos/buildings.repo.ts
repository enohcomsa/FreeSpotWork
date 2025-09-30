import { ObjectId, WithId, Collection, FindOneAndUpdateOptions } from "mongodb";
import { connectToDatabase } from "../db";
import {
  BuildingCreateInput,
  BuildingUpdateInput,
  BuildingResponseDto,
} from "../schemas/buildings.zod";

interface BuildingDoc {
  _id?: ObjectId;
  name: string;
  address: string;
  specialEvent: boolean;
}

async function getCollection(): Promise<Collection<BuildingDoc>> {
  const db = await connectToDatabase();
  return db.collection<BuildingDoc>("buildings");
}

function mapToDto(doc: WithId<BuildingDoc>): BuildingResponseDto {
  return {
    id: doc._id.toHexString(),
    name: doc.name,
    address: doc.address,
    specialEvent: doc.specialEvent,
  };
}

export async function findById(id: string): Promise<BuildingResponseDto | null> {
  const col = await getCollection();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? mapToDto(doc as WithId<BuildingDoc>) : null;
}

export async function insertOne(
  input: BuildingCreateInput
): Promise<BuildingResponseDto> {
  const col = await getCollection();

  const doc: BuildingDoc = {
    name: input.name,
    address: input.address,
    specialEvent: input.specialEvent,
  };

  const result = await col.insertOne(doc);
  const withId: WithId<BuildingDoc> = { _id: result.insertedId, ...doc };
  return mapToDto(withId);
}

export async function updateById(
  id: string,
  patch: BuildingUpdateInput
): Promise<BuildingResponseDto | null> {
  const col = await getCollection();

  const setPatch: Partial<BuildingDoc> = {};
  if (patch.name) setPatch.name = patch.name;
  if (patch.address) setPatch.address = patch.address;
  if (typeof patch.specialEvent === "boolean") {
    setPatch.specialEvent = patch.specialEvent;
  }

  const opts: FindOneAndUpdateOptions = { returnDocument: "after" };

  const updated: WithId<BuildingDoc> | null = await col.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: setPatch },
    opts
  );

  return updated ? mapToDto(updated) : null;
}

export async function deleteById(id: string): Promise<boolean> {
  const col = await getCollection();
  const { deletedCount } = await col.deleteOne({ _id: new ObjectId(id) });
  return deletedCount === 1;
}
