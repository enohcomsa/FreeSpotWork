import type { FacultyCreateInput, FacultyUpdateInput, FacultyResponseDto } from "../schemas/faculties.zod";
import * as repo from "../repos/faculties.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

export async function getFaculty(id: string): Promise<FacultyResponseDto> {
  const res = await repo.findById(id);
  if (!res) throw new NotFoundError("Faculty not found");
  return res;
}

export async function createFaculty(input: FacultyCreateInput): Promise<FacultyResponseDto> {
  try {
    return await repo.insertOne(input);
  } catch (e) {
    mapMongoError(e);
  }
}

export async function updateFaculty(id: string, patch: FacultyUpdateInput): Promise<FacultyResponseDto> {
  try {
    const res = await repo.updateById(id, patch);
    if (!res) throw new NotFoundError("Faculty not found");
    return res;
  } catch (e) {
    mapMongoError(e);
  }
}

export async function deleteFaculty(id: string): Promise<boolean> {
  try {
    const ok = await repo.deleteById(id);
    if (!ok) throw new NotFoundError("Faculty not found");
    return ok;
  } catch (e) {
    mapMongoError(e);
  }
}
