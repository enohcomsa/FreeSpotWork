import type { ProgramYearBaseT, ProgramYearUpdateRequest, ProgramYearResponseDto } from "../schemas/program-years.zod";
import type { ProgramYearDbDoc, ProgramYearDbRecord } from "../db/types/program-years.db";
import { stripUndefined, toObjectId } from "../utils/mongo";

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
  const cleaned = stripUndefined(patch);
  const set: Partial<ProgramYearDbRecord> = {};

  if (cleaned.programId !== undefined) {
    set.programId = toObjectId(cleaned.programId);
  }
  if (cleaned.yearNumber !== undefined) {
    set.yearNumber = cleaned.yearNumber;
  }
  if (cleaned.label !== undefined) {
    set.label = cleaned.label;
  }

  return set;
}
