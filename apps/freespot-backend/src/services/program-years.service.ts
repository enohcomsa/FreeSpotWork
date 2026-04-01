import type {
  ProgramYearCreateRequest,
  ProgramYearUpdateRequest,
  ProgramYearResponseDto,
} from "../schemas/program-years.zod";
import * as repo from "../repos/program-years.repo";
import { NotFoundError } from "../errors/app-errors";
import { mapMongoError } from "../errors/mongo-error.mapper";

export async function getProgramYears(): Promise<ProgramYearResponseDto[]> {
  return repo.listProgramYears();
}

export async function getProgramYear(id: string): Promise<ProgramYearResponseDto> {
  const res = await repo.getProgramYearById(id);

  if (!res) {
    throw new NotFoundError("Program year not found");
  }

  return res;
}

export async function createProgramYear(
  input: ProgramYearCreateRequest,
): Promise<ProgramYearResponseDto> {
  try {
    return await repo.createProgramYear(input);
  } catch (error) {
    mapMongoError(error);
  }
}

export async function updateProgramYear(
  id: string,
  patch: ProgramYearUpdateRequest,
): Promise<ProgramYearResponseDto> {
  let res: ProgramYearResponseDto | null;

  try {
    res = await repo.updateProgramYearById(id, patch);
  } catch (error) {
    mapMongoError(error);
  }

  if (!res) {
    throw new NotFoundError("Program year not found");
  }

  return res;
}

export async function deleteProgramYear(id: string): Promise<boolean> {
  let ok: boolean;

  try {
    ok = await repo.deleteProgramYearById(id);
  } catch (error) {
    mapMongoError(error);
  }

  if (!ok) {
    throw new NotFoundError("Program year not found");
  }

  return ok;
}
