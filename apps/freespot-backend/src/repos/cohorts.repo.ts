import { ObjectId, WithId, Collection, FindOneAndUpdateOptions } from "mongodb";
import { connectToDatabase } from "../db";
import {
  CohortCreateInput,
  CohortUpdateInput,
  CohortResponseDto,
} from "../schemas/cohorts.zod";
import { CohortTypeT } from "../schemas/common.zod";

interface CohortDoc {
  _id?: ObjectId;
  type: CohortTypeT;
  programYearId: ObjectId;
  name: string;
  parentGroupId: ObjectId | null;
}
async function getCollection(): Promise<Collection<CohortDoc>> {
  const db = await connectToDatabase();
  return db.collection<CohortDoc>("cohorts");
}

function mapToDto(doc: WithId<CohortDoc>): CohortResponseDto {
  return {
    id: doc._id.toHexString(),
    type: doc.type,
    programYearId: doc.programYearId.toHexString(),
    name: doc.name,
    parentGroupId: doc.parentGroupId ? doc.parentGroupId.toHexString() : null,
  };
}

export async function findById(id: string): Promise<CohortResponseDto | null> {
  const col = await getCollection();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? mapToDto(doc as WithId<CohortDoc>) : null;
}

export async function insertOne(input: CohortCreateInput): Promise<CohortResponseDto> {
  const col = await getCollection();

  const doc: CohortDoc = {
    type: input.type as CohortTypeT,
    programYearId: new ObjectId(input.programYearId),
    name: input.name,
    parentGroupId: input.parentGroupId ? new ObjectId(input.parentGroupId) : null,
  };

  const result = await col.insertOne(doc);
  const withId: WithId<CohortDoc> = { _id: result.insertedId, ...doc };
  return mapToDto(withId);
}

export async function updateById(
  id: string,
  patch: CohortUpdateInput
): Promise<CohortResponseDto | null> {
  const col = await getCollection();

  const setPatch: Partial<Pick<CohortDoc, "type" | "name" | "parentGroupId">> = {};
  if (patch.type) setPatch.type = patch.type as CohortTypeT;
  if (patch.name) setPatch.name = patch.name;
  if ("parentGroupId" in patch) {
    setPatch.parentGroupId = patch.parentGroupId ? new ObjectId(patch.parentGroupId) : null;
  }

  const opts: FindOneAndUpdateOptions = { returnDocument: "after" };
  const updated = await col.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: setPatch }, opts);

  return updated ? mapToDto(updated as WithId<CohortDoc>) : null;
}

export async function deleteById(id: string): Promise<boolean> {
  const col = await getCollection();
  const { deletedCount } = await col.deleteOne({ _id: new ObjectId(id) });
  return deletedCount === 1;
}
