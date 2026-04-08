import { Cohort, CreateCohortCmd, UpdateCohortCmd } from '@free-spot-domain/cohort';
import { CohortCreateDTO, CohortResponseDTO, CohortUpdateDTO } from '@free-spot/api-client';
import { cohortTypeToDto, dtoToCohortType } from './cohort-type.dto.mapper';




export function dtoToDomain(dto: CohortResponseDTO): Cohort {
  return {
    type: dtoToCohortType(dto.type),
    programYearId: dto.programYearId,
    name: dto.name,
    parentGroupId: dto.parentGroupId,
    id: dto.id,
  };
}

export function toCreateDTO(cmd: CreateCohortCmd): CohortCreateDTO {
  return {
    type: cohortTypeToDto(cmd.type),
    programYearId: cmd.programYearId,
    name: cmd.name,
    parentGroupId: cmd.parentGroupId,
  };
}

export function toUpdateDTO(cmd: UpdateCohortCmd): CohortUpdateDTO {
  return {
    type: cmd.type ? cohortTypeToDto(cmd.type) : undefined,
    programYearId: cmd.programYearId,
    name: cmd.name,
    parentGroupId: cmd.parentGroupId,
  };
}
