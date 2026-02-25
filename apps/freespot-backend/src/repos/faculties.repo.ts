import { FacultyDbDoc, FacultyDbRecord } from "../db/types";
import { facultyPatchToDbSet, facultyToDbRecord, facultyToDto } from "../mappers";
import { FacultyCreateRequest, FacultyResponseDto, FacultyUpdateRequest } from "../schemas/faculties.zod";
import { getCollection, isEmptySet, toObjectId } from "../utils/mongo";

const FACULTIES_COLLECTION = "faculties";

export async function listFaculties(): Promise<FacultyResponseDto[]> {
  const collection = await getCollection<FacultyDbDoc>(FACULTIES_COLLECTION);
  const docs = await collection.find({}).sort({ name: 1 }).toArray();
  return docs.map(facultyToDto);
}

export async function getFacultyById(id: string): Promise<FacultyResponseDto | null> {
  const collection = await getCollection<FacultyDbDoc>(FACULTIES_COLLECTION);
  const doc = await collection.findOne({ _id: toObjectId(id) });
  return doc ? facultyToDto(doc) : null;
}

export async function createFaculty(input: FacultyCreateRequest): Promise<FacultyResponseDto> {
  const collection = await getCollection<FacultyDbRecord>(FACULTIES_COLLECTION);
  const record = facultyToDbRecord(input);
  const result = await collection.insertOne(record);
  return facultyToDto({ _id: result.insertedId, ...record });
}

export async function updateFacultyById(id: string, patch: FacultyUpdateRequest): Promise<FacultyResponseDto | null> {
  const collection = await getCollection<FacultyDbDoc>(FACULTIES_COLLECTION);
  const updateSet = facultyPatchToDbSet(patch);
  if (isEmptySet(updateSet)) {
    const current = await collection.findOne({ _id: toObjectId(id) });
    return current ? facultyToDto(current) : null;
  }
  const updated = await collection.findOneAndUpdate({ _id: toObjectId(id) }, { $set: updateSet }, { returnDocument: "after" });
  return updated ? facultyToDto(updated) : null;
}

export async function deleteFacultyById(id: string): Promise<boolean> {
  const collection = await getCollection<FacultyDbDoc>(FACULTIES_COLLECTION);
  const { deletedCount } = await collection.deleteOne({ _id: toObjectId(id) });
  return deletedCount === 1;
}
