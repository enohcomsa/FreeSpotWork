import {
  BuildingResponseDTO,
  EventCreateDTO,
  EventResponseDTO,
  EventTypeDTO,
  EventUpdateDTO,
  RoomResponseDTO,
} from '@free-spot/api-client';

import {
  AdminEventsBuilding,
  AdminEventsRoom,
  AdminEventType,
  AdminSpecialEvent,
  CreateAdminSpecialEventCmd,
  UpdateAdminSpecialEventCmd,
} from '@free-spot/admin-events/domain';

export function mapAdminEventDtoToDomain(dto: EventResponseDTO): AdminSpecialEvent {
  return {
    id: dto.id,
    name: dto.name,
    date: dto.date,
    startHour: dto.startHour,
    buildingId: dto.buildingId,
    roomId: dto.roomId,
    reservedSpots: dto.reservedSpots,
    type: mapEventTypeDtoToDomain(dto.type),
  };
}

export function mapAdminEventsBuildingDtoToDomain(dto: BuildingResponseDTO): AdminEventsBuilding {
  return {
    id: dto.id,
    name: dto.name,
    address: dto.address,
  };
}

export function mapAdminEventsRoomDtoToDomain(dto: RoomResponseDTO): AdminEventsRoom {
  return {
    id: dto.id,
    name: dto.name,
    buildingId: dto.buildingId,
    floorId: dto.floorId,
    totalSpotsNumber: dto.totalSpotsNumber,
    unavailableSpots: dto.unavailableSpots,
    subjectList: dto.subjectList,
  };
}

export function mapCreateAdminEventCmdToDto(cmd: CreateAdminSpecialEventCmd): EventCreateDTO {
  return {
    name: cmd.name,
    date: cmd.date,
    startHour: cmd.startHour,
    buildingId: cmd.buildingId,
    roomId: cmd.roomId,
    reservedSpots: cmd.reservedSpots,
    type: mapEventTypeDomainToDto(cmd.type),
  };
}

export function mapUpdateAdminEventCmdToDto(cmd: UpdateAdminSpecialEventCmd): EventUpdateDTO {
  return {
    name: cmd.name,
    date: cmd.date,
    startHour: cmd.startHour,
    buildingId: cmd.buildingId,
    roomId: cmd.roomId,
    reservedSpots: cmd.reservedSpots,
    type: mapEventTypeDomainToDto(cmd.type),
  };
}

function mapEventTypeDtoToDomain(type: EventTypeDTO | undefined): AdminEventType | undefined {
  if (type === EventTypeDTO.SPECIAL) {
    return AdminEventType.Special;
  }

  return undefined;
}

function mapEventTypeDomainToDto(type: AdminEventType | undefined): EventTypeDTO | undefined {
  if (type === AdminEventType.Special) {
    return EventTypeDTO.SPECIAL;
  }

  return undefined;
}
