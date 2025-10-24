import { SubjectDbDoc, SubjectDbRecord } from "../db/types";
import { subjectPatchToDbSet, subjectToDbRecord, subjectToDto } from "../mappers";
import { SubjectCreateRequest, SubjectResponseDto, SubjectUpdateRequest } from "../schemas/subjects.zod";
import { getCollection, isEmptySet, toObjectId } from "../utils/mongo";

const SUBJECTS_COLLECTION = "subjects";

export async function listSubjects(): Promise<SubjectResponseDto[]> {
  const collection = await getCollection<SubjectDbDoc>(SUBJECTS_COLLECTION);
  const docs = await collection.find({}).sort({ name: 1 }).toArray();
  return docs.map(subjectToDto);
}

export async function getSubjectById(id: string): Promise<SubjectResponseDto | null> {
  const collection = await getCollection<SubjectDbDoc>(SUBJECTS_COLLECTION);
  const doc = await collection.findOne({ _id: toObjectId(id) });
  return doc ? subjectToDto(doc) : null;
}

export async function createSubject(input: SubjectCreateRequest): Promise<SubjectResponseDto> {
  const collection = await getCollection<SubjectDbRecord>(SUBJECTS_COLLECTION);
  const record = subjectToDbRecord(input);
  const result = await collection.insertOne(record);
  return subjectToDto({ _id: result.insertedId, ...record });
}

export async function updateSubjectById(id: string, patch: SubjectUpdateRequest): Promise<SubjectResponseDto | null> {
  const collection = await getCollection<SubjectDbDoc>(SUBJECTS_COLLECTION);
  const updateSet = subjectPatchToDbSet(patch);
  if (isEmptySet(updateSet)) {
    const current = await collection.findOne({ _id: toObjectId(id) });
    return current ? subjectToDto(current) : null;
  }
  const updated = await collection.findOneAndUpdate({ _id: toObjectId(id) }, { $set: updateSet }, { returnDocument: "after" });
  return updated ? subjectToDto(updated) : null;
}

export async function deleteSubjectById(id: string): Promise<boolean> {
  const collection = await getCollection<SubjectDbDoc>(SUBJECTS_COLLECTION);
  const { deletedCount } = await collection.deleteOne({ _id: toObjectId(id) });
  return deletedCount === 1;
}
