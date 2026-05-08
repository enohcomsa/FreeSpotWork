import {
  type BuildingResponseDTO,
  type FloorResponseDTO,
  type RoomResponseDTO,
} from '@free-spot/api-client';
import {
  type BuildingCardVm,
  type UniversityMapFloor,
  type UniversityMapRoom,
} from '@free-spot/university-map/domain';

export function dtoToBuildingCardVm(dto: BuildingResponseDTO): BuildingCardVm {
  if (!dto.id) {
    throw new Error('Building id is required');
  }

  return {
    id: dto.id,
    name: dto.name ?? '',
    address: dto.address ?? '',
    floors: [],
  };
}

export function dtoToUniversityMapRoom(dto: RoomResponseDTO): UniversityMapRoom {
  if (!dto.id) {
    throw new Error('Room id is required');
  }

  return {
    id: dto.id,
    name: dto.name ?? '',
    floorId: dto.floorId ?? null,
  };
}

export function dtoToUniversityMapFloor(dto: FloorResponseDTO): UniversityMapFloor {
  if (!dto.id) {
    throw new Error('Floor id is required');
  }

  return {
    id: dto.id,
    name: dto.name ?? '',
    buildingId: dto.buildingId ?? null,
  };
}
