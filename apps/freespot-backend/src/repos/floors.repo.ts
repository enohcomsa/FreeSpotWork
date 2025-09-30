// src/repos/floors.repo.ts
import { ObjectId, WithId, Collection, FindOneAndUpdateOptions } from "mongodb";
import { connectToDatabase } from "../db";
import {
  FloorCreateInput,
  FloorUpdateInput,
  FloorResponseDto,
} from "../schemas/floors.zod";

interface FloorDoc {
  _id?: ObjectId;
  buildingId: ObjectId;
  name: string;
  totalSpotsNumber: number;
  unavailableSpots: number;
}

async function getCollection(): Promise<Collection<FloorDoc>> {
  const db = await connectToDatabase();
  return db.collection<FloorDoc>("floors");
}

function mapToDto(doc: WithId<FloorDoc>): FloorResponseDto {
  return {
    id: doc._id.toHexString(),
    buildingId: doc.buildingId.toHexString(),
    name: doc.name,
    totalSpotsNumber: doc.totalSpotsNumber,
    unavailableSpots: doc.unavailableSpots,
  };
}

export async function findById(id: string): Promise<FloorResponseDto | null> {
  const col = await getCollection();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? mapToDto(doc as WithId<FloorDoc>) : null;
}

export async function insertOne(input: FloorCreateInput): Promise<FloorResponseDto> {
  const col = await getCollection();
  const doc: FloorDoc = {
    buildingId: new ObjectId(input.buildingId),
    name: input.name,
    totalSpotsNumber: input.totalSpotsNumber,
    unavailableSpots: input.unavailableSpots,
  };
  const result = await col.insertOne(doc);
  const withId: WithId<FloorDoc> = { _id: result.insertedId, ...doc };
  return mapToDto(withId);
}

export async function updateById(
  id: string,
  patch: FloorUpdateInput
): Promise<FloorResponseDto | null> {
  const col = await getCollection();
  const setPatch: Partial<FloorDoc> = {};
  if (patch.name) setPatch.name = patch.name;
  if (patch.totalSpotsNumber !== undefined) setPatch.totalSpotsNumber = patch.totalSpotsNumber;
  if (patch.unavailableSpots !== undefined) setPatch.unavailableSpots = patch.unavailableSpots;
  const opts: FindOneAndUpdateOptions = { returnDocument: "after" };
  const updated: WithId<FloorDoc> | null = await col.findOneAndUpdate(
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
