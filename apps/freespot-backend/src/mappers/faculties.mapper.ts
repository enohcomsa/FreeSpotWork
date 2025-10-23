import type { FacultyBaseT, FacultyResponseDto } from "../schemas/faculties.zod";
import type { FacultyDbDoc, FacultyDbRecord } from "../db/types/faculties.db";

export function facultyToDbRecord(input: FacultyBaseT): FacultyDbRecord {
  return {
    name: input.name,
    shortName: input.shortName,
  };
}

export function facultyToDto(doc: FacultyDbDoc): FacultyResponseDto {
  return {
    id: doc._id.toHexString(),
    name: doc.name,
    shortName: doc.shortName,
  };
}

export function facultyPatchToDbSet(patch: Partial<FacultyBaseT>): Partial<FacultyDbRecord> {
  const set: Partial<FacultyDbRecord> = {};
  if (Object.prototype.hasOwnProperty.call(patch, "name") && patch.name !== undefined) set.name = patch.name;
  if (Object.prototype.hasOwnProperty.call(patch, "shortName") && patch.shortName !== undefined) set.shortName = patch.shortName;
  return set;
}
