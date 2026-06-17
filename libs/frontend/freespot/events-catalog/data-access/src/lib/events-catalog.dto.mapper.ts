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

export function eventDtoToDomain(dto: EventResponseDTO): EventsCatalogEvent {
  if (!dto.id) {
    throw new Error('Missing event id');
  }

  if (!dto.name) {
    throw new Error('Missing event name');
  }

  if (!dto.date) {
    throw new Error('Missing event date');
  }

  if (!dto.buildingId) {
    throw new Error('Missing event building id');
  }

  if (!dto.roomId) {
    throw new Error('Missing event room id');
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

export function buildingDtoToDomain(dto: BuildingResponseDTO): EventsCatalogBuilding {
  if (!dto.id) {
    throw new Error('Missing building id');
  }

  return {
    id: dto.id,
    name: dto.name ?? '',
    address: dto.address ?? '',
  };
}

export function roomDtoToDomain(dto: RoomResponseDTO): EventsCatalogRoom {
  if (!dto.id) {
    throw new Error('Missing room id');
  }

  return {
    id: dto.id,
    name: dto.name ?? '',
    totalSpotsNumber: dto.totalSpotsNumber ?? 0,
    unavailableSpots: dto.unavailableSpots ?? 0,
  };
}

export function bookingDtoToDomain(dto: BookingResponseDTO): EventsCatalogBooking {
  return {
    activityId: dto.activityId ?? null,
  };
}
