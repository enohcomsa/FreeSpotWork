import { Building, CreateBuildingCmd, UpdateBuildingCmd } from '@free-spot-domain/building';
import { BuildingCreateDTO, BuildingResponseDTO, BuildingUpdateDTO } from '@free-spot/api-client';

export function dtoToDomain(dto: BuildingResponseDTO): Building {
  return {
    id: dto.id,
    name: dto.name,
    address: dto.address,
  };
}

export function toCreateDTO(cmd: CreateBuildingCmd): BuildingCreateDTO {
  return {
    name: cmd.name,
    address: cmd.address,
  };
}

export function toUpdateDTO(cmd: UpdateBuildingCmd): BuildingUpdateDTO {
  return {
    name: cmd.name,
    address: cmd.address,
  };
}
