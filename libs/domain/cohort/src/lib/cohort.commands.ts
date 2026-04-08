import { CohortType } from "./cohort-type.enum";


export type CreateCohortCmd = {
  type: CohortType;
  programYearId: string;
  name: string;
  parentGroupId?: string | null;
};

export type UpdateCohortCmd = Partial<CreateCohortCmd>;
