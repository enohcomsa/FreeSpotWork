import type { SubjectCreateRequest, SubjectUpdateRequest, SubjectResponseDto } from "../schemas/subjects.zod";
import * as repo from "../repos/subjects.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

export async function getSubjects(): Promise<SubjectResponseDto[]> { return repo.listSubjects(); }

export async function getSubject(id: string): Promise<SubjectResponseDto> {
  const res = await repo.getSubjectById(id);
  if (!res) throw new NotFoundError("Subject not found");
  return res;
}

export async function createSubject(input: SubjectCreateRequest): Promise<SubjectResponseDto> {
  try { return await repo.createSubject(input); } catch (e) { mapMongoError(e); }
}

export async function updateSubject(id: string, patch: SubjectUpdateRequest): Promise<SubjectResponseDto> {
  try {
    const res = await repo.updateSubjectById(id, patch);
    if (!res) throw new NotFoundError("Subject not found");
    return res;
  } catch (e) { mapMongoError(e); }
}

export async function deleteSubject(id: string): Promise<boolean> {
  try {
    const ok = await repo.deleteSubjectById(id);
    if (!ok) throw new NotFoundError("Subject not found");
    return ok;
  } catch (e) { mapMongoError(e); }
}
