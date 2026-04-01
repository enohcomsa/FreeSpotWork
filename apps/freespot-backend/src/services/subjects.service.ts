import type {
  SubjectCreateRequest,
  SubjectUpdateRequest,
  SubjectResponseDto,
} from "../schemas/subjects.zod";
import * as repo from "../repos/subjects.repo";
import { NotFoundError } from "../errors/app-errors";
import { mapMongoError } from "../errors/mongo-error.mapper";

export async function getSubjects(): Promise<SubjectResponseDto[]> {
  return repo.listSubjects();
}

export async function getSubject(id: string): Promise<SubjectResponseDto> {
  const res = await repo.getSubjectById(id);

  if (!res) {
    throw new NotFoundError("Subject not found");
  }

  return res;
}

export async function createSubject(
  input: SubjectCreateRequest,
): Promise<SubjectResponseDto> {
  try {
    return await repo.createSubject(input);
  } catch (error) {
    mapMongoError(error);
  }
}

export async function updateSubject(
  id: string,
  patch: SubjectUpdateRequest,
): Promise<SubjectResponseDto> {
  let res: SubjectResponseDto | null;

  try {
    res = await repo.updateSubjectById(id, patch);
  } catch (error) {
    mapMongoError(error);
  }

  if (!res) {
    throw new NotFoundError("Subject not found");
  }

  return res;
}

export async function deleteSubject(id: string): Promise<boolean> {
  let ok: boolean;

  try {
    ok = await repo.deleteSubjectById(id);
  } catch (error) {
    mapMongoError(error);
  }

  if (!ok) {
    throw new NotFoundError("Subject not found");
  }

  return ok;
}
