import type { ProgramBaseT, ProgramUpdateRequest, ProgramResponseDto } from "../schemas/programs.zod";
import type { ProgramDbDoc, ProgramDbRecord } from "../db/types/programs.db";
import { toObjectId } from "../utils/mongo";

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
  const set: Partial<ProgramDbRecord> = {};
  if (Object.prototype.hasOwnProperty.call(patch, "facultyId") && (patch).facultyId !== undefined) {
    set.facultyId = toObjectId((patch).facultyId);
  }
  if (Object.prototype.hasOwnProperty.call(patch, "name") && patch.name !== undefined) {
    set.name = patch.name;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "degree") && patch.degree !== undefined) {
    set.degree = patch.degree;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "active") && patch.active !== undefined) {
    set.active = patch.active;
  }
  return set;
}
