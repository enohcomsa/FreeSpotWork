import {
  type BookingResponseDTO,
  type BuildingResponseDTO,
  type EventResponseDTO,
  type RoomResponseDTO,
} from '@free-spot/api-client';
import {
  type EventsCatalogBooking,
  type EventsCatalogBuilding,
  type EventsCatalogEvent,
  type EventsCatalogRoom,
} from '@free-spot/events-catalog/domain';

export function dtoToEventsCatalogEvent(dto: EventResponseDTO): EventsCatalogEvent {
  if (!dto.id) {
    throw new Error('Event id is required');
  }

  if (!dto.name) {
    throw new Error('Event name is required');
  }

  if (!dto.date) {
    throw new Error('Event date is required');
  }

  if (!dto.buildingId) {
    throw new Error('Event buildingId is required');
  }

  if (!dto.roomId) {
    throw new Error('Event roomId is required');
  }

  return {
    id: dto.id,
    name: dto.name,
    date: dto.date,
    buildingId: dto.buildingId,
    roomId: dto.roomId,
    reservedSpots: dto.reservedSpots ?? 0,
  };
}

export function dtoToEventsCatalogBuilding(dto: BuildingResponseDTO): EventsCatalogBuilding {
  if (!dto.id) {
    throw new Error('Building id is required');
  }

  return {
    id: dto.id,
    name: dto.name ?? '',
    address: dto.address ?? '',
  };
}

export function dtoToEventsCatalogRoom(dto: RoomResponseDTO): EventsCatalogRoom {
  if (!dto.id) {
    throw new Error('Room id is required');
  }

  return {
    id: dto.id,
    name: dto.name ?? '',
    totalSpotsNumber: dto.totalSpotsNumber ?? 0,
    unavailableSpots: dto.unavailableSpots ?? 0,
  };
}

export function dtoToEventsCatalogBooking(dto: BookingResponseDTO): EventsCatalogBooking {
  return {
    activityId: dto.activityId ?? null,
  };
}
