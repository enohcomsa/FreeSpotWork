import { ObjectId, WithId, Collection, FindOneAndUpdateOptions } from "mongodb";
import { connectToDatabase } from "../db";
import {
  RoomCreateInput,
  RoomUpdateInput,
  RoomResponseDto,
} from "../schemas/rooms.zod";

interface RoomDoc {
  _id?: ObjectId;
  buildingId: ObjectId;
  floorId: ObjectId;
  name: string;
  totalSpotsNumber: number;
  unavailableSpots: number;
  subjectList: ObjectId[];
}

async function getCollection(): Promise<Collection<RoomDoc>> {
  const db = await connectToDatabase();
  return db.collection<RoomDoc>("rooms");
}

function mapToDto(doc: WithId<RoomDoc>): RoomResponseDto {
  return {
    id: doc._id.toHexString(),
    buildingId: doc.buildingId.toHexString(),
    floorId: doc.floorId.toHexString(),
    name: doc.name,
    totalSpotsNumber: doc.totalSpotsNumber,
    unavailableSpots: doc.unavailableSpots,
    subjectList: doc.subjectList.map((s) => s.toHexString()),
  };
}

export async function findById(id: string): Promise<RoomResponseDto | null> {
  const col = await getCollection();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? mapToDto(doc as WithId<RoomDoc>) : null;
}

export async function insertOne(input: RoomCreateInput): Promise<RoomResponseDto> {
  const col = await getCollection();
  const doc: RoomDoc = {
    buildingId: new ObjectId(input.buildingId),
    floorId: new ObjectId(input.floorId),
    name: input.name,
    totalSpotsNumber: input.totalSpotsNumber,
    unavailableSpots: input.unavailableSpots,
    subjectList: input.subjectList.map((id) => new ObjectId(id)),
  };
  const result = await col.insertOne(doc);
  const withId: WithId<RoomDoc> = { _id: result.insertedId, ...doc };
  return mapToDto(withId);
}

export async function updateById(
  id: string,
  patch: RoomUpdateInput
): Promise<RoomResponseDto | null> {
  const col = await getCollection();
  const setPatch: Partial<RoomDoc> = {};
  if (patch.floorId) setPatch.floorId = new ObjectId(patch.floorId);
  if (patch.name) setPatch.name = patch.name;
  if (patch.totalSpotsNumber !== undefined) setPatch.totalSpotsNumber = patch.totalSpotsNumber;
  if (patch.unavailableSpots !== undefined) setPatch.unavailableSpots = patch.unavailableSpots;
  if (patch.subjectList) setPatch.subjectList = patch.subjectList.map((id) => new ObjectId(id));
  const opts: FindOneAndUpdateOptions = { returnDocument: "after" };
  const updated: WithId<RoomDoc> | null = await col.findOneAndUpdate(
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
