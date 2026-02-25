import type { ProgramYearCreateRequest, ProgramYearUpdateRequest, ProgramYearResponseDto } from "../schemas/program-years.zod";
import * as repo from "../repos/program-years.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

export async function getProgramYears(): Promise<ProgramYearResponseDto[]> { return repo.listProgramYears(); }

export async function getProgramYear(id: string): Promise<ProgramYearResponseDto> {
  const res = await repo.getProgramYearById(id);
  if (!res) throw new NotFoundError("Program year not found");
  return res;
}

export async function createProgramYear(input: ProgramYearCreateRequest): Promise<ProgramYearResponseDto> {
  try { return await repo.createProgramYear(input); } catch (e) { mapMongoError(e); }
}

export async function updateProgramYear(id: string, patch: ProgramYearUpdateRequest): Promise<ProgramYearResponseDto> {
  try {
    const res = await repo.updateProgramYearById(id, patch);
    if (!res) throw new NotFoundError("Program year not found");
    return res;
  } catch (e) { mapMongoError(e); }
}

export async function deleteProgramYear(id: string): Promise<boolean> {
  try {
    const ok = await repo.deleteProgramYearById(id);
    if (!ok) throw new NotFoundError("Program year not found");
    return ok;
  } catch (e) { mapMongoError(e); }
}
