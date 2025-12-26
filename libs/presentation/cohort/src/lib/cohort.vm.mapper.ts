import { CohortVM } from "./cohort.vm";
import { Cohort } from '@free-spot-domain/cohort';


export function toCohortVM(cohort: Cohort): CohortVM {
  return {
    type: cohort.type,
    programYearId: cohort.programYearId,
    name: cohort.name,
    parentGroupId: cohort.parentGroupId,
    id: cohort.id,
  };
}
