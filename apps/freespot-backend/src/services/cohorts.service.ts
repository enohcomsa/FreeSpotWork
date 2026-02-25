import type { CohortCreateRequest, CohortUpdateRequest, CohortResponseDto } from "../schemas/cohorts.zod";
import * as repo from "../repos/cohorts.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

export async function getCohorts(): Promise<CohortResponseDto[]> { return repo.listCohorts(); }

export async function getCohort(id: string): Promise<CohortResponseDto> {
  const res = await repo.getCohortById(id);
  if (!res) throw new NotFoundError("Cohort not found");
  return res;
}

export async function createCohort(input: CohortCreateRequest): Promise<CohortResponseDto> {
  try { return await repo.createCohort(input); } catch (e) { mapMongoError(e); }
}

export async function updateCohort(id: string, patch: CohortUpdateRequest): Promise<CohortResponseDto> {
  try {
    const res = await repo.updateCohortById(id, patch);
    if (!res) throw new NotFoundError("Cohort not found");
    return res;
  } catch (e) { mapMongoError(e); }
}

export async function deleteCohort(id: string): Promise<boolean> {
  try {
    const ok = await repo.deleteCohortById(id);
    if (!ok) throw new NotFoundError("Cohort not found");
    return ok;
  } catch (e) { mapMongoError(e); }
}
