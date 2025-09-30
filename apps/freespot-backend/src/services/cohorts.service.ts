import type { CohortCreateInput, CohortUpdateInput, CohortResponseDto } from "../schemas/cohorts.zod";
import * as repo from "../repos/cohorts.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

export async function getCohort(id: string): Promise<CohortResponseDto> {
  const res = await repo.findById(id);
  if (!res) throw new NotFoundError("Cohort not found");
  return res;
}

export async function createCohort(input: CohortCreateInput): Promise<CohortResponseDto> {
  try {
    return await repo.insertOne(input);
  } catch (e) {
    mapMongoError(e);
  }
}

export async function updateCohort(id: string, patch: CohortUpdateInput): Promise<CohortResponseDto> {
  try {
    const res = await repo.updateById(id, patch);
    if (!res) throw new NotFoundError("Cohort not found");
    return res;
  } catch (e) {
    mapMongoError(e);
  }
}

export async function deleteCohort(id: string): Promise<boolean> {
  try {
    const ok = await repo.deleteById(id);
    if (!ok) throw new NotFoundError("Cohort not found");
    return ok;
  } catch (e) {
    mapMongoError(e);
  }
}
