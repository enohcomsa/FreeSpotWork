import { ProgramYearResponseDTO, ProgramYearCreateDTO, ProgramYearUpdateDTO } from '@free-spot/api-client';
import { CreateProgramYearCmd, UpdateProgramYearCmd } from "./program-year.commands";
import { ProgramYear } from "./program-year.model";



export function dtoToDomain(dto: ProgramYearResponseDTO): ProgramYear {
  return {
    id: dto.id,
    programId: dto.programId,
    yearNumber: dto.yearNumber,
    label: dto.label,
  };
}

export function toCreateDTO(cmd: CreateProgramYearCmd): ProgramYearCreateDTO {
  return {
    programId: cmd.programId,
    yearNumber: cmd.yearNumber,
    label: cmd.label,
  };
}

export function toUpdateDTO(cmd: UpdateProgramYearCmd): ProgramYearUpdateDTO {
  return {
    programId: cmd.programId,
    yearNumber: cmd.yearNumber,
    label: cmd.label,
  };
}
