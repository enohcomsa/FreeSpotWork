import type { ProgramYearBaseT, ProgramYearUpdateRequest, ProgramYearResponseDto } from "../schemas/program-years.zod";
import type { ProgramYearDbDoc, ProgramYearDbRecord } from "../db/types/program-years.db";
import { toObjectId } from "../utils/mongo";

export function programYearToDbRecord(input: ProgramYearBaseT): ProgramYearDbRecord {
  return {
    programId: toObjectId(input.programId),
    yearNumber: input.yearNumber,
    label: input.label,
  };
}

export function programYearToDto(doc: ProgramYearDbDoc): ProgramYearResponseDto {
  return {
    id: doc._id.toHexString(),
    programId: doc.programId.toHexString(),
    yearNumber: doc.yearNumber,
    label: doc.label,
  };
}

export function programYearPatchToDbSet(patch: ProgramYearUpdateRequest): Partial<ProgramYearDbRecord> {
  const set: Partial<ProgramYearDbRecord> = {};
  if (Object.prototype.hasOwnProperty.call(patch, "programId") && (patch).programId !== undefined) {
    set.programId = toObjectId((patch).programId);
  }
  if (Object.prototype.hasOwnProperty.call(patch, "yearNumber") && patch.yearNumber !== undefined) {
    set.yearNumber = patch.yearNumber;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "label") && patch.label !== undefined) {
    set.label = patch.label;
  }
  return set;
}
