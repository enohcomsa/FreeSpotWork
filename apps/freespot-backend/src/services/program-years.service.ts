// src/services/programYears.service.ts
import type { ProgramYearCreateInput, ProgramYearUpdateInput, ProgramYearResponseDto } from "../schemas/program-years.zod";
import * as repo from "../repos/program-years.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

export async function getProgramYear(id: string): Promise<ProgramYearResponseDto> {
  const res = await repo.findById(id);
  if (!res) throw new NotFoundError("Program year not found");
  return res;
}

export async function createProgramYear(input: ProgramYearCreateInput): Promise<ProgramYearResponseDto> {
  try {
    return await repo.insertOne(input);
  } catch (e) {
    mapMongoError(e);
  }
}

export async function updateProgramYear(id: string, patch: ProgramYearUpdateInput): Promise<ProgramYearResponseDto> {
  try {
    const res = await repo.updateById(id, patch);
    if (!res) throw new NotFoundError("Program year not found");
    return res;
  } catch (e) {
    mapMongoError(e);
  }
}

export async function deleteProgramYear(id: string): Promise<boolean> {
  try {
    const ok = await repo.deleteById(id);
    if (!ok) throw new NotFoundError("Program year not found");
    return ok;
  } catch (e) {
    mapMongoError(e);
  }
}
