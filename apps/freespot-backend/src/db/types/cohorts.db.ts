import { ObjectId } from "mongodb";
import type { CohortTypeT } from "../../schemas/common.zod";

export type CohortDbBase = {
  type: CohortTypeT;
  programYearId: ObjectId;
  name: string;
  parentGroupId: ObjectId | null;
};

export type CohortDbDoc = CohortDbBase & { _id: ObjectId };
export type CohortDbRecord = CohortDbBase;
