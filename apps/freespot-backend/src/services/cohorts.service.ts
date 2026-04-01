import type {
  CohortCreateRequest,
  CohortUpdateRequest,
  CohortResponseDto,
} from "../schemas/cohorts.zod";
import * as repo from "../repos/cohorts.repo";
import { NotFoundError } from "../errors/app-errors";
import { mapMongoError } from "../errors/mongo-error.mapper";

export async function getCohorts(): Promise<CohortResponseDto[]> {
  return repo.listCohorts();
}

export async function getCohort(id: string): Promise<CohortResponseDto> {
  const res = await repo.getCohortById(id);

  if (!res) {
    throw new NotFoundError("Cohort not found");
  }

  return res;
}

export async function createCohort(
  input: CohortCreateRequest,
): Promise<CohortResponseDto> {
  try {
    return await repo.createCohort(input);
  } catch (error) {
    mapMongoError(error);
  }
}

export async function updateCohort(
  id: string,
  patch: CohortUpdateRequest,
): Promise<CohortResponseDto> {
  let res: CohortResponseDto | null;

  try {
    res = await repo.updateCohortById(id, patch);
  } catch (error) {
    mapMongoError(error);
  }

  if (!res) {
    throw new NotFoundError("Cohort not found");
  }

  return res;
}

export async function deleteCohort(id: string): Promise<boolean> {
  let ok: boolean;

  try {
    ok = await repo.deleteCohortById(id);
  } catch (error) {
    mapMongoError(error);
  }

  if (!ok) {
    throw new NotFoundError("Cohort not found");
  }

  return ok;
}
