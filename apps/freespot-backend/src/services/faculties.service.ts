import type { FacultyCreateRequest, FacultyUpdateRequest, FacultyResponseDto } from "../schemas/faculties.zod";
import * as repo from "../repos/faculties.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

export async function getFaculties(): Promise<FacultyResponseDto[]> { return repo.listFaculties(); }

export async function getFaculty(id: string): Promise<FacultyResponseDto> {
  const res = await repo.getFacultyById(id);
  if (!res) throw new NotFoundError("Faculty not found");
  return res;
}

export async function createFaculty(input: FacultyCreateRequest): Promise<FacultyResponseDto> {
  try { return await repo.createFaculty(input); } catch (e) { mapMongoError(e); }
}

export async function updateFaculty(id: string, patch: FacultyUpdateRequest): Promise<FacultyResponseDto> {
  try {
    const res = await repo.updateFacultyById(id, patch);
    if (!res) throw new NotFoundError("Faculty not found");
    return res;
  } catch (e) { mapMongoError(e); }
}

export async function deleteFaculty(id: string): Promise<boolean> {
  try {
    const ok = await repo.deleteFacultyById(id);
    if (!ok) throw new NotFoundError("Faculty not found");
    return ok;
  } catch (e) { mapMongoError(e); }
}
