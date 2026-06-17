import {
  type BuildingCreateDTO,
  type BuildingResponseDTO,
  type BuildingsCardResponseDTO,
  type BuildingUpdateDTO,
  type FloorCreateDTO,
  type FloorResponseDTO,
  type FloorUpdateDTO,
  type RoomCreateDTO,
  type RoomResponseDTO,
  type RoomUpdateDTO,
} from '@free-spot/api-client';
import {
  type AdminUniversityMapBuilding,
  type AdminUniversityMapBuildingCard,
  type AdminUniversityMapFloor,
  type AdminUniversityMapFloorCard,
  type AdminUniversityMapRoom,
  type CreateAdminUniversityMapBuildingCmd,
  type CreateAdminUniversityMapFloorCmd,
  type CreateAdminUniversityMapRoomCmd,
  type UpdateAdminUniversityMapBuildingCmd,
  type UpdateAdminUniversityMapFloorCmd,
  type UpdateAdminUniversityMapRoomCmd,
} from '@free-spot/admin-university-map/domain';

export function buildingDtoToDomain(dto: BuildingResponseDTO): AdminUniversityMapBuilding {
  return {
    id: dto.id,
    name: dto.name,
    address: dto.address,
  };
}

export function buildingCardDtoToDomain(dto: BuildingsCardResponseDTO): AdminUniversityMapBuildingCard {
  return {
    id: dto.id,
    name: dto.name,
    address: dto.address,
    floors: dto.floors.map(floorCardDtoToDomain),
  };
}

export function floorDtoToDomain(dto: FloorResponseDTO): AdminUniversityMapFloor {
  return {
    id: dto.id,
    buildingId: dto.buildingId,
    name: dto.name,
  };
}

export function roomDtoToDomain(dto: RoomResponseDTO): AdminUniversityMapRoom {
  return {
    id: dto.id,
    buildingId: dto.buildingId,
    floorId: dto.floorId,
    name: dto.name,
    totalSpotsNumber: dto.totalSpotsNumber,
    unavailableSpots: dto.unavailableSpots,
    subjectList: dto.subjectList ?? [],
  };
}

export function createBuildingCmdToDto(cmd: CreateAdminUniversityMapBuildingCmd): BuildingCreateDTO {
  return {
    name: cmd.name,
    address: cmd.address,
  };
}

export function updateBuildingCmdToDto(cmd: UpdateAdminUniversityMapBuildingCmd): BuildingUpdateDTO {
  return {
    name: cmd.name,
    address: cmd.address,
  };
}

export function createFloorCmdToDto(cmd: CreateAdminUniversityMapFloorCmd): FloorCreateDTO {
  return {
    buildingId: cmd.buildingId,
    name: cmd.name,
  };
}

export function updateFloorCmdToDto(cmd: UpdateAdminUniversityMapFloorCmd): FloorUpdateDTO {
  return {
    buildingId: cmd.buildingId,
    name: cmd.name,
  };
}

export function createRoomCmdToDto(cmd: CreateAdminUniversityMapRoomCmd): RoomCreateDTO {
  return {
    buildingId: cmd.buildingId,
    floorId: cmd.floorId,
    name: cmd.name,
    totalSpotsNumber: cmd.totalSpotsNumber,
    unavailableSpots: cmd.unavailableSpots,
    subjectList: cmd.subjectList,
  };
}

export function updateRoomCmdToDto(cmd: UpdateAdminUniversityMapRoomCmd): RoomUpdateDTO {
  return {
    buildingId: cmd.buildingId,
    floorId: cmd.floorId,
    name: cmd.name,
    totalSpotsNumber: cmd.totalSpotsNumber,
    unavailableSpots: cmd.unavailableSpots,
    subjectList: cmd.subjectList,
  };
}

function floorCardDtoToDomain(dto: { name: string; total: number; unavailable: number }): AdminUniversityMapFloorCard {
  return {
    name: dto.name,
    total: dto.total,
    unavailable: dto.unavailable,
  };
}
