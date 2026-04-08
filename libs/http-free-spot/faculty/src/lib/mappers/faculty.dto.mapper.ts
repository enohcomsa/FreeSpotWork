import { Faculty, CreateFacultyCmd, UpdateFacultyCmd } from "@free-spot-domain/faculty";
import { FacultyResponseDTO, FacultyCreateDTO, FacultyUpdateDTO } from "@free-spot/api-client";

export function dtoToDomain(dto: FacultyResponseDTO): Faculty {
  return {
    id: dto.id,
    name: dto.name,
    shortName: dto.shortName,
    subjectList: dto.subjectList
  };
}

export function toCreateDTO(cmd: CreateFacultyCmd): FacultyCreateDTO {
  return {
    name: cmd.name,
    shortName: cmd.shortName,
    subjectList: cmd.subjectList
  };
}

export function toUpdateDTO(cmd: UpdateFacultyCmd): FacultyUpdateDTO {
  return {
    name: cmd.name,
    shortName: cmd.shortName,
    subjectList: cmd.subjectList
  };
}
