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

export function buildingDtoToVm(dto: BuildingResponseDTO): BuildingCardVm {
  if (!dto.id) {
    throw new Error('Missing building id');
  }

  return {
    id: dto.id,
    name: dto.name ?? '',
    address: dto.address ?? '',
    floors: [],
  };
}

export function roomDtoToDomain(dto: RoomResponseDTO): UniversityMapRoom {
  if (!dto.id) {
    throw new Error('Missing room id');
  }

  return {
    id: dto.id,
    name: dto.name ?? '',
    floorId: dto.floorId ?? null,
  };
}

export function floorDtoToDomain(dto: FloorResponseDTO): UniversityMapFloor {
  if (!dto.id) {
    throw new Error('Missing floor id');
  }

  return {
    id: dto.id,
    name: dto.name ?? '',
    buildingId: dto.buildingId ?? null,
  };
}
