import { ProgramDbDoc, ProgramDbRecord } from "../db/types";
import { programPatchToDbSet, programToDbRecord, programToDto } from "../mappers";
import { ProgramCreateRequest, ProgramResponseDto, ProgramUpdateRequest } from "../schemas/programs.zod";
import { getCollection, isEmptySet, toObjectId } from "../utils/mongo";

const PROGRAMS_COLLECTION = "programs";

export async function listPrograms(): Promise<ProgramResponseDto[]> {
  const collection = await getCollection<ProgramDbDoc>(PROGRAMS_COLLECTION);
  const docs = await collection.find({}).sort({ name: 1 }).toArray();
  return docs.map(programToDto);
}

export async function getProgramById(id: string): Promise<ProgramResponseDto | null> {
  const collection = await getCollection<ProgramDbDoc>(PROGRAMS_COLLECTION);
  const doc = await collection.findOne({ _id: toObjectId(id) });
  return doc ? programToDto(doc) : null;
}

export async function createProgram(input: ProgramCreateRequest): Promise<ProgramResponseDto> {
  const collection = await getCollection<ProgramDbRecord>(PROGRAMS_COLLECTION);
  const record = programToDbRecord(input);
  const result = await collection.insertOne(record);
  return programToDto({ _id: result.insertedId, ...record });
}

export async function updateProgramById(id: string, patch: ProgramUpdateRequest): Promise<ProgramResponseDto | null> {
  const collection = await getCollection<ProgramDbDoc>(PROGRAMS_COLLECTION);
  const updateSet = programPatchToDbSet(patch);
  if (isEmptySet(updateSet)) {
    const current = await collection.findOne({ _id: toObjectId(id) });
    return current ? programToDto(current) : null;
  }
  const updated = await collection.findOneAndUpdate({ _id: toObjectId(id) }, { $set: updateSet }, { returnDocument: "after" });
  return updated ? programToDto(updated) : null;
}

export async function deleteProgramById(id: string): Promise<boolean> {
  const collection = await getCollection<ProgramDbDoc>(PROGRAMS_COLLECTION);
  const { deletedCount } = await collection.deleteOne({ _id: toObjectId(id) });
  return deletedCount === 1;
}
