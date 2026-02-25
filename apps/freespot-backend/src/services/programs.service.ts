import type { ProgramCreateRequest, ProgramUpdateRequest, ProgramResponseDto } from "../schemas/programs.zod";
import * as repo from "../repos/programs.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

export async function getPrograms(): Promise<ProgramResponseDto[]> { return repo.listPrograms(); }

export async function getProgram(id: string): Promise<ProgramResponseDto> {
  const res = await repo.getProgramById(id);
  if (!res) throw new NotFoundError("Program not found");
  return res;
}

export async function createProgram(input: ProgramCreateRequest): Promise<ProgramResponseDto> {
  try { return await repo.createProgram(input); } catch (e) { mapMongoError(e); }
}

export async function updateProgram(id: string, patch: ProgramUpdateRequest): Promise<ProgramResponseDto> {
  try {
    const res = await repo.updateProgramById(id, patch);
    if (!res) throw new NotFoundError("Program not found");
    return res;
  } catch (e) { mapMongoError(e); }
}

export async function deleteProgram(id: string): Promise<boolean> {
  try {
    const ok = await repo.deleteProgramById(id);
    if (!ok) throw new NotFoundError("Program not found");
    return ok;
  } catch (e) { mapMongoError(e); }
}
