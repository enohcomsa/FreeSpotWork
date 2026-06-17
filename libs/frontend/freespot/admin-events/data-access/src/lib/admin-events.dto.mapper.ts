import {
  type BuildingResponseDTO,
  type EventCreateDTO,
  type EventResponseDTO,
  EventTypeDTO,
  type EventUpdateDTO,
  type RoomResponseDTO,
} from '@free-spot/api-client';

import {
  type AdminEventsBuilding,
  type AdminEventsRoom,
  type AdminEventType,
  type AdminSpecialEvent,
  type CreateAdminSpecialEventCmd,
  type UpdateAdminSpecialEventCmd,
} from '@free-spot/admin-events/domain';

export function adminEventDtoToDomain(dto: EventResponseDTO): AdminSpecialEvent {
  return {
    id: dto.id,
    name: dto.name,
    date: dto.date,
    startHour: dto.startHour,
    buildingId: dto.buildingId,
    roomId: dto.roomId,
    reservedSpots: dto.reservedSpots,
    type: toEventType(dto.type),
  };
}

export function buildingDtoToDomain(dto: BuildingResponseDTO): AdminEventsBuilding {
  return {
    id: dto.id,
    name: dto.name,
    address: dto.address,
  };
}

export function roomDtoToDomain(dto: RoomResponseDTO): AdminEventsRoom {
  return {
    id: dto.id,
    name: dto.name,
    buildingId: dto.buildingId,
    floorId: dto.floorId,
    totalSpotsNumber: dto.totalSpotsNumber,
    unavailableSpots: dto.unavailableSpots,
    subjectList: dto.subjectList ?? [],
  };
}

export function createAdminEventCmdToDto(cmd: CreateAdminSpecialEventCmd): EventCreateDTO {
  return {
    name: cmd.name,
    date: cmd.date,
    startHour: cmd.startHour,
    buildingId: cmd.buildingId,
    roomId: cmd.roomId,
    reservedSpots: cmd.reservedSpots,
    type: toEventTypeDto(cmd.type),
  };
}

export function updateAdminEventCmdToDto(cmd: UpdateAdminSpecialEventCmd): EventUpdateDTO {
  return {
    name: cmd.name,
    date: cmd.date,
    startHour: cmd.startHour,
    buildingId: cmd.buildingId,
    roomId: cmd.roomId,
    reservedSpots: cmd.reservedSpots,
    type: toEventTypeDto(cmd.type),
  };
}

function toEventType(value: EventTypeDTO | undefined): AdminEventType | undefined {
  if (!value) {
    return undefined;
  }

  return value as AdminEventType;
}

function toEventTypeDto(value: AdminEventType | undefined): EventTypeDTO | undefined {
  if (!value) {
    return undefined;
  }

  return value as EventTypeDTO;
}
