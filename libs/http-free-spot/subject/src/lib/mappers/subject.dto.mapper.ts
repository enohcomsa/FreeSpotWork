import { SubjectItem, CreateSubjectItemCmd, UpdateSubjectItemCmd } from '@free-spot-domain/subject';
import { SubjectCreateDTO, SubjectResponseDTO, SubjectUpdateDTO } from '@free-spot/api-client';

export function dtoToDomain(dto: SubjectResponseDTO): SubjectItem {
  return {
    name: dto.name,
    shortName: dto.shortName,
    id: dto.id,
  };
}

export function toCreateDTO(cmd: CreateSubjectItemCmd): SubjectCreateDTO {
  return {
    name: cmd.name,
    shortName: cmd.shortName,
  };
}

export function toUpdateDTO(cmd: UpdateSubjectItemCmd): SubjectUpdateDTO {
  return {
    name: cmd.name,
    shortName: cmd.shortName,
  };
}
