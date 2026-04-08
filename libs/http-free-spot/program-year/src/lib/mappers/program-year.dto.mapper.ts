import { CreateProgramYearCmd, ProgramYear, UpdateProgramYearCmd } from '@free-spot-domain/program-year';
import { ProgramYearResponseDTO, ProgramYearCreateDTO, ProgramYearUpdateDTO } from '@free-spot/api-client';


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
