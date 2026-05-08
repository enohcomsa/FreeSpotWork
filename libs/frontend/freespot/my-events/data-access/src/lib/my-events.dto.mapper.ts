import {
  type BookingResponseDTO,
  type BuildingResponseDTO,
  type EventResponseDTO,
  type FloorResponseDTO,
  type RoomResponseDTO,
  ActivityTypeDTO
} from '@free-spot/api-client';
import {
  MyEventsActivityType,
  type MyEventsBooking,
  type MyEventsBuilding,
  type MyEventsEvent,
  type MyEventsFloor,
  type MyEventsRoom,
} from '@free-spot/my-events/domain';

function mapActivityType(dto: ActivityTypeDTO): MyEventsActivityType {
  switch (dto) {
    case ActivityTypeDTO.LABORATORY:
      return MyEventsActivityType.LABORATORY;
    case ActivityTypeDTO.COURSE:
      return MyEventsActivityType.COURSE;
    case ActivityTypeDTO.PROJECT:
      return MyEventsActivityType.PROJECT;
    case ActivityTypeDTO.SEMINAR:
      return MyEventsActivityType.SEMINAR;
    case ActivityTypeDTO.SPECIAL_EVENT:
      return MyEventsActivityType.SPECIAL_EVENT;
    default:
      throw new Error('Invalid activity type');
  }
}

export function dtoToMyEventsBooking(dto: BookingResponseDTO): MyEventsBooking {
  if (!dto.id) {
    throw new Error('Booking id is required');
  }

  return {
    id: dto.id,
    activityId: dto.activityId ?? null,
    activityType: mapActivityType(dto.activityType),
  };
}

export function dtoToMyEventsEvent(dto: EventResponseDTO): MyEventsEvent {
  if (!dto.id) {
    throw new Error('Event id is required');
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

export function dtoToMyEventsBuilding(dto: BuildingResponseDTO): MyEventsBuilding {
  if (!dto.id) {
    throw new Error('Building id is required');
  }

  return {
    id: dto.id,
    name: dto.name ?? '',
  };
}

export function dtoToMyEventsFloor(dto: FloorResponseDTO): MyEventsFloor {
  if (!dto.id) {
    throw new Error('Floor id is required');
  }

  return {
    id: dto.id,
    name: dto.name ?? '',
  };
}

export function dtoToMyEventsRoom(dto: RoomResponseDTO): MyEventsRoom {
  if (!dto.id) {
    throw new Error('Room id is required');
  }

  return {
    id: dto.id,
    name: dto.name ?? '',
    floorId: dto.floorId ?? null,
  };
}
