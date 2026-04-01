import type {
  ProgramCreateRequest,
  ProgramUpdateRequest,
  ProgramResponseDto,
} from "../schemas/programs.zod";
import * as repo from "../repos/programs.repo";
import { NotFoundError } from "../errors/app-errors";
import { mapMongoError } from "../errors/mongo-error.mapper";

export async function getPrograms(): Promise<ProgramResponseDto[]> {
  return repo.listPrograms();
}

export async function getProgram(id: string): Promise<ProgramResponseDto> {
  const res = await repo.getProgramById(id);

  if (!res) {
    throw new NotFoundError("Program not found");
  }

  return res;
}

export async function createProgram(
  input: ProgramCreateRequest,
): Promise<ProgramResponseDto> {
  try {
    return await repo.createProgram(input);
  } catch (error) {
    mapMongoError(error);
  }
}

export async function updateProgram(
  id: string,
  patch: ProgramUpdateRequest,
): Promise<ProgramResponseDto> {
  let res: ProgramResponseDto | null;

  try {
    res = await repo.updateProgramById(id, patch);
  } catch (error) {
    mapMongoError(error);
  }

  if (!res) {
    throw new NotFoundError("Program not found");
  }

  return res;
}

export async function deleteProgram(id: string): Promise<boolean> {
  let ok: boolean;

  try {
    ok = await repo.deleteProgramById(id);
  } catch (error) {
    mapMongoError(error);
  }

  if (!ok) {
    throw new NotFoundError("Program not found");
  }

  return ok;
}
