import { ObjectId, WithId, Collection, FindOneAndUpdateOptions } from "mongodb";
import { connectToDatabase } from "../db";
import {
  ProgramYearCreateInput,
  ProgramYearUpdateInput,
  ProgramYearResponseDto,
} from "../schemas/program-years.zod";

interface ProgramYearDoc {
  _id?: ObjectId;
  programId: ObjectId;
  yearNumber: number;
  label: string;
}

async function getCollection(): Promise<Collection<ProgramYearDoc>> {
  const db = await connectToDatabase();
  return db.collection<ProgramYearDoc>("program_years");
}

function mapToDto(doc: WithId<ProgramYearDoc>): ProgramYearResponseDto {
  return {
    id: doc._id.toHexString(),
    programId: doc.programId.toHexString(),
    yearNumber: doc.yearNumber,
    label: doc.label,
  };
}

export async function findById(id: string): Promise<ProgramYearResponseDto | null> {
  const col = await getCollection();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? mapToDto(doc as WithId<ProgramYearDoc>) : null;
}

export async function insertOne(
  input: ProgramYearCreateInput
): Promise<ProgramYearResponseDto> {
  const col = await getCollection();
  const doc: ProgramYearDoc = {
    programId: new ObjectId(input.programId),
    yearNumber: input.yearNumber,
    label: input.label,
  };
  const result = await col.insertOne(doc);
  const withId: WithId<ProgramYearDoc> = { _id: result.insertedId, ...doc };
  return mapToDto(withId);
}

export async function updateById(
  id: string,
  patch: ProgramYearUpdateInput
): Promise<ProgramYearResponseDto | null> {
  const col = await getCollection();
  const setPatch: Partial<ProgramYearDoc> = {};
  if (patch.yearNumber !== undefined) setPatch.yearNumber = patch.yearNumber;
  if (patch.label) setPatch.label = patch.label;
  const opts: FindOneAndUpdateOptions = { returnDocument: "after" };
  const updated: WithId<ProgramYearDoc> | null = await col.findOneAndUpdate(
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
