import { CohortCreateDTO, CohortResponseDTO, CohortUpdateDTO } from '@free-spot/api-client';
import { CreateCohortCmd, UpdateCohortCmd } from './cohort.commands';
import { Cohort } from './cohort.model';



export function dtoToDomain(dto: CohortResponseDTO): Cohort {
  return {
    type: dto.type,
    programYearId: dto.programYearId,
    name: dto.name,
    parentGroupId: dto.parentGroupId,
    id: dto.id,
  };
}

export function toCreateDTO(cmd: CreateCohortCmd): CohortCreateDTO {
  return {
    type: cmd.type,
    programYearId: cmd.programYearId,
    name: cmd.name,
    parentGroupId: cmd.parentGroupId,
  };
}

export function toUpdateDTO(cmd: UpdateCohortCmd): CohortUpdateDTO {
  return {
    type: cmd.type,
    programYearId: cmd.programYearId,
    name: cmd.name,
    parentGroupId: cmd.parentGroupId,
  };
}
