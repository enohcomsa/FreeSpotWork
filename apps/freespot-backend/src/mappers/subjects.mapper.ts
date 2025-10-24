import type { SubjectBaseT, SubjectResponseDto } from "../schemas/subjects.zod";
import type { SubjectDbDoc, SubjectDbRecord } from "../db/types/subjects.db";
import { stripUndefined } from "../utils/mongo";

export function subjectToDbRecord(input: SubjectBaseT): SubjectDbRecord {
  return {
    name: input.name,
    shortName: input.shortName,
  };
}

export function subjectToDto(doc: SubjectDbDoc): SubjectResponseDto {
  return {
    id: doc._id.toHexString(),
    name: doc.name,
    shortName: doc.shortName,
  };
}

export function subjectPatchToDbSet(patch: Partial<SubjectBaseT>): Partial<SubjectDbRecord> {
  const cleaned = stripUndefined(patch);
  const set: Partial<SubjectDbRecord> = {};

  if (cleaned.name !== undefined) set.name = cleaned.name;
  if (cleaned.shortName !== undefined) set.shortName = cleaned.shortName;

  return set;
}
