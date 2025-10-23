import { FloorCreateDTO, FloorResponseDTO, FloorUpdateDTO } from '@free-spot/api-client';
import { Floor } from './floor.model';
import { CreateFloorCmd, UpdateFloorCmd } from './floor.commands';

export function dtoToDomain(dto: FloorResponseDTO): Floor {
  return {
    buildingId: dto.buildingId,
    name: dto.name,
    totalSpotsNumber: dto.totalSpotsNumber,
    unavailableSpots: dto.unavailableSpots,
    id: dto.id,
  };
}

export function toCreateDTO(cmd: CreateFloorCmd): FloorCreateDTO {
  return {
    buildingId: cmd.buildingId,
    name: cmd.name,
    totalSpotsNumber: cmd.totalSpotsNumber,
    unavailableSpots: cmd.unavailableSpots,
  };
}

export function toUpdateDTO(cmd: UpdateFloorCmd): FloorUpdateDTO {
  return {
    buildingId: cmd.buildingId,
    name: cmd.name,
    totalSpotsNumber: cmd.totalSpotsNumber,
    unavailableSpots: cmd.unavailableSpots,
  };
}
