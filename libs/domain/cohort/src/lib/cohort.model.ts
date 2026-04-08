import { CohortType } from "./cohort-type.enum";

export interface Cohort {
  type: CohortType;
  programYearId: string;
  name: string;
  parentGroupId?: string | null;
  id: string;
};
