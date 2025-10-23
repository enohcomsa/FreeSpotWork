import type { CohortBaseT, CohortUpdateRequest, CohortResponseDto } from "../schemas/cohorts.zod";
import type { CohortDbDoc, CohortDbRecord } from "../db/types/cohorts.db";
import { toObjectId } from "../utils/mongo";

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
  const set: Partial<CohortDbRecord> = {};
  if (Object.prototype.hasOwnProperty.call(patch, "type") && patch.type !== undefined) set.type = patch.type;
  if (Object.prototype.hasOwnProperty.call(patch, "programYearId") && (patch).programYearId !== undefined) set.programYearId = toObjectId((patch).programYearId);
  if (Object.prototype.hasOwnProperty.call(patch, "name") && patch.name !== undefined) set.name = patch.name;
  if (Object.prototype.hasOwnProperty.call(patch, "parentGroupId")) {
    const p = patch.parentGroupId as string | null | undefined;
    set.parentGroupId = p == null ? null : toObjectId(p);
  }
  return set;
}
