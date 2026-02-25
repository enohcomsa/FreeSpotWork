import type { CohortBaseT, CohortUpdateRequest, CohortResponseDto } from "../schemas/cohorts.zod";
import type { CohortDbDoc, CohortDbRecord } from "../db/types/cohorts.db";
import { stripUndefined, toObjectId } from "../utils/mongo";

export function cohortToDbRecord(input: CohortBaseT): CohortDbRecord {
  return {
    type: input.type,
    programYearId: toObjectId(input.programYearId),
    name: input.name,
    parentGroupId: input.parentGroupId == null ? null : toObjectId(input.parentGroupId),
  };
}

export function cohortToDto(doc: CohortDbDoc): CohortResponseDto {
  return {
    id: doc._id.toHexString(),
    type: doc.type,
    programYearId: doc.programYearId.toHexString(),
    name: doc.name,
    parentGroupId: doc.parentGroupId == null ? null : doc.parentGroupId.toHexString(),
  };
}

export function cohortPatchToDbSet(patch: CohortUpdateRequest): Partial<CohortDbRecord> {
  const cleaned = stripUndefined(patch);
  const set: Partial<CohortDbRecord> = {};

  if (cleaned.type !== undefined) set.type = cleaned.type;
  if (cleaned.programYearId !== undefined) set.programYearId = toObjectId(cleaned.programYearId);
  if (cleaned.name !== undefined) set.name = cleaned.name;
  if (cleaned.parentGroupId !== undefined)
    set.parentGroupId = cleaned.parentGroupId === null ? null : toObjectId(cleaned.parentGroupId);

  return set;
}
