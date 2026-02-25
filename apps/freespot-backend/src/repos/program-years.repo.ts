import { ProgramYearDbDoc, ProgramYearDbRecord } from "../db/types";
import { programYearPatchToDbSet, programYearToDbRecord, programYearToDto } from "../mappers";
import { ProgramYearCreateRequest, ProgramYearResponseDto, ProgramYearUpdateRequest } from "../schemas/program-years.zod";
import { getCollection, isEmptySet, toObjectId } from "../utils/mongo";

const PROGRAM_YEARS_COLLECTION = "program_years";

export async function listProgramYears(): Promise<ProgramYearResponseDto[]> {
  const collection = await getCollection<ProgramYearDbDoc>(PROGRAM_YEARS_COLLECTION);
  const docs = await collection.find({}).sort({ yearNumber: 1 }).toArray();
  return docs.map(programYearToDto);
}

export async function getProgramYearById(id: string): Promise<ProgramYearResponseDto | null> {
  const collection = await getCollection<ProgramYearDbDoc>(PROGRAM_YEARS_COLLECTION);
  const doc = await collection.findOne({ _id: toObjectId(id) });
  return doc ? programYearToDto(doc) : null;
}

export async function createProgramYear(input: ProgramYearCreateRequest): Promise<ProgramYearResponseDto> {
  const collection = await getCollection<ProgramYearDbRecord>(PROGRAM_YEARS_COLLECTION);
  const record = programYearToDbRecord(input);
  const result = await collection.insertOne(record);
  return programYearToDto({ _id: result.insertedId, ...record });
}

export async function updateProgramYearById(id: string, patch: ProgramYearUpdateRequest): Promise<ProgramYearResponseDto | null> {
  const collection = await getCollection<ProgramYearDbDoc>(PROGRAM_YEARS_COLLECTION);
  const updateSet = programYearPatchToDbSet(patch);
  if (isEmptySet(updateSet)) {
    const current = await collection.findOne({ _id: toObjectId(id) });
    return current ? programYearToDto(current) : null;
  }
  const updated = await collection.findOneAndUpdate({ _id: toObjectId(id) }, { $set: updateSet }, { returnDocument: "after" });
  return updated ? programYearToDto(updated) : null;
}

export async function deleteProgramYearById(id: string): Promise<boolean> {
  const collection = await getCollection<ProgramYearDbDoc>(PROGRAM_YEARS_COLLECTION);
  const { deletedCount } = await collection.deleteOne({ _id: toObjectId(id) });
  return deletedCount === 1;
}
