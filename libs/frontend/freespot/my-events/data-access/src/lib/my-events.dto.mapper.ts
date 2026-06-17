import {
  type ActivityTypeDTO,
  type BookingResponseDTO,
  type BuildingResponseDTO,
  type EventResponseDTO,
  type FloorResponseDTO,
  type RoomResponseDTO,
} from '@free-spot/api-client';
import {
  type MyEventsBooking,
  type MyEventsBuilding,
  type MyEventsEvent,
  type MyEventsFloor,
  type MyEventsRoom,
} from '@free-spot/my-events/domain';
import { ActivityType } from '@free-spot/shared/domain';

export function bookingDtoToDomain(dto: BookingResponseDTO): MyEventsBooking {
  if (!dto.id) {
    throw new Error('Missing booking id');
  }

  return {
    id: dto.id,
    activityId: dto.activityId ?? null,
    activityType: toActivityType(dto.activityType),
  };
}

export function eventDtoToDomain(dto: EventResponseDTO): MyEventsEvent {
  if (!dto.id) {
    throw new Error('Missing event id');
  }

  return {
    id: dto.id,
    name: dto.name ?? '',
    date: dto.date ?? null,
    startHour: dto.startHour ?? 0,
    buildingId: dto.buildingId ?? null,
    roomId: dto.roomId ?? null,
  };
}

export function buildingDtoToDomain(dto: BuildingResponseDTO): MyEventsBuilding {
  if (!dto.id) {
    throw new Error('Missing building id');
  }

  return {
    id: dto.id,
    name: dto.name ?? '',
  };
}

export function floorDtoToDomain(dto: FloorResponseDTO): MyEventsFloor {
  if (!dto.id) {
    throw new Error('Missing floor id');
  }

  return {
    id: dto.id,
    name: dto.name ?? '',
  };
}

export function roomDtoToDomain(dto: RoomResponseDTO): MyEventsRoom {
  if (!dto.id) {
    throw new Error('Missing room id');
  }

  return {
    id: dto.id,
    name: dto.name ?? '',
    floorId: dto.floorId ?? null,
  };
}

function toActivityType(value: ActivityTypeDTO | undefined): ActivityType {
  if (!value) {
    throw new Error('Missing activity type');
  }

  return value as ActivityType;
}
