import { CohortTypeDTO } from '@free-spot/api-client';

export interface Cohort {
  type: CohortTypeDTO;
  programYearId: string;
  name: string;
  parentGroupId?: string | null;
  id: string;
};
