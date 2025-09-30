import type { SubjectCreateInput, SubjectUpdateInput, SubjectResponseDto } from "../schemas/subjects.zod";
import * as repo from "../repos/subjects.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

export async function getSubject(id: string): Promise<SubjectResponseDto> {
  const res = await repo.findById(id);
  if (!res) throw new NotFoundError("Subject not found");
  return res;
}

export async function createSubject(input: SubjectCreateInput): Promise<SubjectResponseDto> {
  try {
    return await repo.insertOne(input);
  } catch (e) {
    mapMongoError(e);
  }
}

export async function updateSubject(id: string, patch: SubjectUpdateInput): Promise<SubjectResponseDto> {
  try {
    const res = await repo.updateById(id, patch);
    if (!res) throw new NotFoundError("Subject not found");
    return res;
  } catch (e) {
    mapMongoError(e);
  }
}

export async function deleteSubject(id: string): Promise<boolean> {
  try {
    const ok = await repo.deleteById(id);
    if (!ok) throw new NotFoundError("Subject not found");
    return ok;
  } catch (e) {
    mapMongoError(e);
  }
}
