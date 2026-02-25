import type { FacultyBaseT, FacultyResponseDto } from "../schemas/faculties.zod";
import type { FacultyDbDoc, FacultyDbRecord } from "../db/types/faculties.db";
import { stripUndefined, toObjectId } from "../utils/mongo";

export function facultyToDbRecord(input: FacultyBaseT): FacultyDbRecord {
  return {
    name: input.name,
    shortName: input.shortName,
    subjectList: input.subjectList.map(toObjectId),
  };
}

export function facultyToDto(doc: FacultyDbDoc): FacultyResponseDto {
  return {
    id: doc._id.toHexString(),
    name: doc.name,
    shortName: doc.shortName,
    subjectList: doc.subjectList.map((oid) => oid.toHexString()),
  };
}

export function facultyPatchToDbSet(patch: Partial<FacultyBaseT>): Partial<FacultyDbRecord> {
  const cleaned = stripUndefined(patch);
  const set: Partial<FacultyDbRecord> = {};

  if (cleaned.name !== undefined) set.name = cleaned.name;
  if (cleaned.shortName !== undefined) set.shortName = cleaned.shortName;
  if (cleaned.subjectList !== undefined) set.subjectList = cleaned.subjectList.map(toObjectId);

  return set;
}
