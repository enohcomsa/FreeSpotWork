import { CohortTypeDTO } from '@free-spot/api-client';

export type CreateCohortCmd = {
  type: CohortTypeDTO;
  programYearId: string;
  name: string;
  parentGroupId?: string | null;
};

export type UpdateCohortCmd = Partial<CreateCohortCmd>;
