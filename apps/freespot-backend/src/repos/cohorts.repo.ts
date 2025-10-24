import { CohortDbDoc, CohortDbRecord } from "../db/types";
import { cohortPatchToDbSet, cohortToDbRecord, cohortToDto } from "../mappers";
import { CohortCreateRequest, CohortResponseDto, CohortUpdateRequest } from "../schemas/cohorts.zod";
import { getCollection, isEmptySet, toObjectId } from "../utils/mongo";

const COHORTS_COLLECTION = "cohorts";

export async function listCohorts(): Promise<CohortResponseDto[]> {
  const collection = await getCollection<CohortDbDoc>(COHORTS_COLLECTION);
  const docs = await collection.find({}).sort({ name: 1 }).toArray();
  return docs.map(cohortToDto);
}

export async function getCohortById(id: string): Promise<CohortResponseDto | null> {
  const collection = await getCollection<CohortDbDoc>(COHORTS_COLLECTION);
  const doc = await collection.findOne({ _id: toObjectId(id) });
  return doc ? cohortToDto(doc) : null;
}

export async function createCohort(input: CohortCreateRequest): Promise<CohortResponseDto> {
  const collection = await getCollection<CohortDbRecord>(COHORTS_COLLECTION);
  const record = cohortToDbRecord(input);
  const result = await collection.insertOne(record);
  return cohortToDto({ _id: result.insertedId, ...record });
}

export async function updateCohortById(id: string, patch: CohortUpdateRequest): Promise<CohortResponseDto | null> {
  const collection = await getCollection<CohortDbDoc>(COHORTS_COLLECTION);
  const updateSet = cohortPatchToDbSet(patch);
  if (isEmptySet(updateSet)) {
    const current = await collection.findOne({ _id: toObjectId(id) });
    return current ? cohortToDto(current) : null;
  }
  const updated = await collection.findOneAndUpdate({ _id: toObjectId(id) }, { $set: updateSet }, { returnDocument: "after" });
  return updated ? cohortToDto(updated) : null;
}

export async function deleteCohortById(id: string): Promise<boolean> {
  const collection = await getCollection<CohortDbDoc>(COHORTS_COLLECTION);
  const { deletedCount } = await collection.deleteOne({ _id: toObjectId(id) });
  return deletedCount === 1;
}
