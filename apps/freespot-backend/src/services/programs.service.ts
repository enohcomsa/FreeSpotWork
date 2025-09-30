import type { ProgramCreateInput, ProgramUpdateInput, ProgramResponseDto } from "../schemas/programs.zod";
import * as repo from "../repos/programs.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

export async function getProgram(id: string): Promise<ProgramResponseDto> {
  const res = await repo.findById(id);
  if (!res) throw new NotFoundError("Program not found");
  return res;
}

export async function createProgram(input: ProgramCreateInput): Promise<ProgramResponseDto> {
  try {
    return await repo.insertOne(input);
  } catch (e) {
    mapMongoError(e);
  }
}

export async function updateProgram(id: string, patch: ProgramUpdateInput): Promise<ProgramResponseDto> {
  try {
    const res = await repo.updateById(id, patch);
    if (!res) throw new NotFoundError("Program not found");
    return res;
  } catch (e) {
    mapMongoError(e);
  }
}

export async function deleteProgram(id: string): Promise<boolean> {
  try {
    const ok = await repo.deleteById(id);
    if (!ok) throw new NotFoundError("Program not found");
    return ok;
  } catch (e) {
    mapMongoError(e);
  }
}
