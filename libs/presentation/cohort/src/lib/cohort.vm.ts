import { CohortType } from "@free-spot-domain/cohort";

export interface CohortVM {
  type: CohortType;
  programYearId: string;
  name: string;
  parentGroupId?: string | null;
  id: string;
};
