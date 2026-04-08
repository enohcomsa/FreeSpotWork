import { CohortType } from "@free-spot-domain/cohort";
import { CohortTypeDTO } from "@free-spot/api-client";


export const dtoToCohortType = (dto: CohortTypeDTO): CohortType => dto as unknown as CohortType;
export const cohortTypeToDto = (value: CohortType): CohortTypeDTO => value as unknown as CohortTypeDTO;
