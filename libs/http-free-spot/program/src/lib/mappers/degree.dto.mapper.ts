import { ProgramCreateDTO, ProgramResponseDTO, ProgramUpdateDTO } from '@free-spot/api-client';
import { CreateProgramCmd, Program, UpdateProgramCmd } from '@free-spot-domain/program';
import { degreeTypeToDto, dtoToDegreeType } from './degree-type.dto.mapper';

export function dtoToDomain(dto: ProgramResponseDTO): Program {
  return {
    id: dto.id,
    facultyId: dto.facultyId,
    name: dto.name,
    degree: dtoToDegreeType(dto.degree),
    active: dto.active,
  };
}

export function toCreateDTO(cmd: CreateProgramCmd): ProgramCreateDTO {
  return {
    facultyId: cmd.facultyId,
    name: cmd.name,
    degree: degreeTypeToDto(cmd.degree),
    active: cmd.active,
  };
}

export function toUpdateDTO(cmd: UpdateProgramCmd): ProgramUpdateDTO {
  return {
    facultyId: cmd.facultyId,
    name: cmd.name,
    degree: cmd.degree ? degreeTypeToDto(cmd.degree) : undefined,
    active: cmd.active,
  };
}
