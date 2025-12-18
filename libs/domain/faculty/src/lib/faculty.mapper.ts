import { FacultyResponseDTO, FacultyCreateDTO, FacultyUpdateDTO } from "@free-spot/api-client";
import { CreateFacultyCmd, UpdateFacultyCmd } from "./faculty.commands";
import { Faculty } from "./faculty.model";

export function dtoToDomain(dto: FacultyResponseDTO): Faculty {
  return {
    id: dto.id,
    name: dto.name,
    shortName: dto.shortName
  };
}

export function toCreateDTO(cmd: CreateFacultyCmd): FacultyCreateDTO {
  return {
    name: cmd.name,
    shortName: cmd.shortName
  };
}

export function toUpdateDTO(cmd: UpdateFacultyCmd): FacultyUpdateDTO {
  return {
    name: cmd.name,
    shortName: cmd.shortName
  };
}
