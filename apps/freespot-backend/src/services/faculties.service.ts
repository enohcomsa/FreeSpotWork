import type {
  FacultyCreateRequest,
  FacultyUpdateRequest,
  FacultyResponseDto,
} from "../schemas/faculties.zod";
import * as repo from "../repos/faculties.repo";
import { NotFoundError } from "../errors/app-errors";
import { mapMongoError } from "../errors/mongo-error.mapper";

export async function getFaculties(): Promise<FacultyResponseDto[]> {
  return repo.listFaculties();
}

export async function getFaculty(id: string): Promise<FacultyResponseDto> {
  const res = await repo.getFacultyById(id);

  if (!res) {
    throw new NotFoundError("Faculty not found");
  }

  return res;
}

export async function createFaculty(
  input: FacultyCreateRequest,
): Promise<FacultyResponseDto> {
  try {
    return await repo.createFaculty(input);
  } catch (error) {
    mapMongoError(error);
  }
}

export async function updateFaculty(
  id: string,
  patch: FacultyUpdateRequest,
): Promise<FacultyResponseDto> {
  let res: FacultyResponseDto | null;

  try {
    res = await repo.updateFacultyById(id, patch);
  } catch (error) {
    mapMongoError(error);
  }

  if (!res) {
    throw new NotFoundError("Faculty not found");
  }

  return res;
}

export async function deleteFaculty(id: string): Promise<boolean> {
  let ok: boolean;

  try {
    ok = await repo.deleteFacultyById(id);
  } catch (error) {
    mapMongoError(error);
  }

  if (!ok) {
    throw new NotFoundError("Faculty not found");
  }

  return ok;
}
