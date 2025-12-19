import { ProgramCreateDTO, ProgramResponseDTO, ProgramUpdateDTO } from '@free-spot/api-client';
import { CreateProgramCmd, UpdateProgramCmd } from './program.commands';
import { Program } from './program.model';



export function dtoToDomain(dto: ProgramResponseDTO): Program {
  return {
    id: dto.id,
    facultyId: dto.facultyId,
    name: dto.name,
    degree: dto.degree,
    active: dto.active,
  };
}

export function toCreateDTO(cmd: CreateProgramCmd): ProgramCreateDTO {
  return {
    facultyId: cmd.facultyId,
    name: cmd.name,
    degree: cmd.degree,
    active: cmd.active,
  };
}

export function toUpdateDTO(cmd: UpdateProgramCmd): ProgramUpdateDTO {
  return {
     facultyId: cmd.facultyId,
    name: cmd.name,
    degree: cmd.degree,
    active: cmd.active,
  };
}
