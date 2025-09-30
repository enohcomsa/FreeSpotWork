import { ObjectId, WithId, Collection, FindOneAndUpdateOptions } from "mongodb";
import { connectToDatabase } from "../db";
import {
  SubjectCreateInput,
  SubjectUpdateInput,
  SubjectResponseDto,
} from "../schemas/subjects.zod";

interface SubjectDoc {
  _id?: ObjectId;
  name: string;
  shortName: string;
}

async function getCollection(): Promise<Collection<SubjectDoc>> {
  const db = await connectToDatabase();
  return db.collection<SubjectDoc>("subjects");
}

function mapToDto(doc: WithId<SubjectDoc>): SubjectResponseDto {
  return {
    id: doc._id.toHexString(),
    name: doc.name,
    shortName: doc.shortName,
  };
}

export async function findById(id: string): Promise<SubjectResponseDto | null> {
  const col = await getCollection();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? mapToDto(doc as WithId<SubjectDoc>) : null;
}

export async function insertOne(input: SubjectCreateInput): Promise<SubjectResponseDto> {
  const col = await getCollection();
  const doc: SubjectDoc = {
    name: input.name,
    shortName: input.shortName,
  };
  const result = await col.insertOne(doc);
  const withId: WithId<SubjectDoc> = { _id: result.insertedId, ...doc };
  return mapToDto(withId);
}

export async function updateById(
  id: string,
  patch: SubjectUpdateInput
): Promise<SubjectResponseDto | null> {
  const col = await getCollection();
  const setPatch: Partial<SubjectDoc> = {};
  if (patch.name) setPatch.name = patch.name;
  if (patch.shortName) setPatch.shortName = patch.shortName;
  const opts: FindOneAndUpdateOptions = { returnDocument: "after" };
  const updated: WithId<SubjectDoc> | null = await col.findOneAndUpdate(
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
