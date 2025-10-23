import type { SubjectBaseT, SubjectResponseDto } from "../schemas/subjects.zod";
import type { SubjectDbDoc, SubjectDbRecord } from "../db/types/subjects.db";

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
  const set: Partial<SubjectDbRecord> = {};
  if (Object.prototype.hasOwnProperty.call(patch, "name") && patch.name !== undefined) set.name = patch.name;
  if (Object.prototype.hasOwnProperty.call(patch, "shortName") && patch.shortName !== undefined) set.shortName = patch.shortName;
  return set;
}
