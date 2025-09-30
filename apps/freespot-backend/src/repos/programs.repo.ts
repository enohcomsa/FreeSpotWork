import { ObjectId, WithId, Collection, FindOneAndUpdateOptions } from "mongodb";
import { connectToDatabase } from "../db";
import {
  ProgramCreateInput,
  ProgramUpdateInput,
  ProgramResponseDto,
} from "../schemas/programs.zod";
import { Degree } from "../schemas/common.zod";
import { z } from "zod";

type DegreeT = z.infer<typeof Degree>;

interface ProgramDoc {
  _id?: ObjectId;
  facultyId: ObjectId;
  name: string;
  degree: DegreeT;
  active: boolean;
}

async function getCollection(): Promise<Collection<ProgramDoc>> {
  const db = await connectToDatabase();
  return db.collection<ProgramDoc>("programs");
}

function mapToDto(doc: WithId<ProgramDoc>): ProgramResponseDto {
  return {
    id: doc._id.toHexString(),
    facultyId: doc.facultyId.toHexString(),
    name: doc.name,
    degree: doc.degree,
    active: doc.active,
  };
}

export async function findById(id: string): Promise<ProgramResponseDto | null> {
  const col = await getCollection();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? mapToDto(doc as WithId<ProgramDoc>) : null;
}

export async function insertOne(input: ProgramCreateInput): Promise<ProgramResponseDto> {
  const col = await getCollection();
  const doc: ProgramDoc = {
    facultyId: new ObjectId(input.facultyId),
    name: input.name,
    degree: input.degree as DegreeT,
    active: input.active,
  };
  const result = await col.insertOne(doc);
  const withId: WithId<ProgramDoc> = { _id: result.insertedId, ...doc };
  return mapToDto(withId);
}

export async function updateById(
  id: string,
  patch: ProgramUpdateInput
): Promise<ProgramResponseDto | null> {
  const col = await getCollection();
  const setPatch: Partial<ProgramDoc> = {};
  if (patch.name) setPatch.name = patch.name;
  if (patch.degree) setPatch.degree = patch.degree as DegreeT;
  if (patch.active !== undefined) setPatch.active = patch.active;
  const opts: FindOneAndUpdateOptions = { returnDocument: "after" };
  const updated: WithId<ProgramDoc> | null = await col.findOneAndUpdate(
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
