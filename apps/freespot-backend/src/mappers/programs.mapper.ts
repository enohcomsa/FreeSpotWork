import type { ProgramBaseT, ProgramUpdateRequest, ProgramResponseDto } from "../schemas/programs.zod";
import type { ProgramDbDoc, ProgramDbRecord } from "../db/types/programs.db";
import { stripUndefined, toObjectId } from "../utils/mongo";

export function programToDbRecord(input: ProgramBaseT): ProgramDbRecord {
  return {
    facultyId: toObjectId(input.facultyId),
    name: input.name,
    degree: input.degree,
    active: input.active,
  };
}

export function programToDto(doc: ProgramDbDoc): ProgramResponseDto {
  return {
    id: doc._id.toHexString(),
    facultyId: doc.facultyId.toHexString(),
    name: doc.name,
    degree: doc.degree,
    active: doc.active,
  };
}

export function programPatchToDbSet(patch: ProgramUpdateRequest): Partial<ProgramDbRecord> {
  const cleaned = stripUndefined(patch);
  const set: Partial<ProgramDbRecord> = {};

  if (cleaned.facultyId !== undefined) set.facultyId = toObjectId(cleaned.facultyId);
  if (cleaned.name !== undefined) set.name = cleaned.name;
  if (cleaned.degree !== undefined) set.degree = cleaned.degree;
  if (cleaned.active !== undefined) set.active = cleaned.active;

  return set;
}
