import { ObjectId, WithId, Collection, FindOneAndUpdateOptions } from "mongodb";
import { connectToDatabase } from "../db";
import {
  FacultyCreateInput,
  FacultyUpdateInput,
  FacultyResponseDto,
} from "../schemas/faculties.zod";

interface FacultyDoc {
  _id?: ObjectId;
  name: string;
  shortName: string;
}

async function getCollection(): Promise<Collection<FacultyDoc>> {
  const db = await connectToDatabase();
  return db.collection<FacultyDoc>("faculties");
}

function mapToDto(doc: WithId<FacultyDoc>): FacultyResponseDto {
  return {
    id: doc._id.toHexString(),
    name: doc.name,
    shortName: doc.shortName,
  };
}

export async function findById(id: string): Promise<FacultyResponseDto | null> {
  const col = await getCollection();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? mapToDto(doc as WithId<FacultyDoc>) : null;
}

export async function insertOne(
  input: FacultyCreateInput
): Promise<FacultyResponseDto> {
  const col = await getCollection();

  const doc: FacultyDoc = {
    name: input.name,
    shortName: input.shortName,
  };

  const result = await col.insertOne(doc);
  const withId: WithId<FacultyDoc> = { _id: result.insertedId, ...doc };
  return mapToDto(withId);
}

export async function updateById(
  id: string,
  patch: FacultyUpdateInput
): Promise<FacultyResponseDto | null> {
  const col = await getCollection();

  const setPatch: Partial<FacultyDoc> = {};
  if (patch.name) setPatch.name = patch.name;
  if (patch.shortName) setPatch.shortName = patch.shortName;

  const opts: FindOneAndUpdateOptions = { returnDocument: "after" };

  const updated: WithId<FacultyDoc> | null = await col.findOneAndUpdate(
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
