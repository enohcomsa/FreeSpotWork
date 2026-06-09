import {
  type ActivityTypeDTO,
  type BookingResponseDTO,
  type BookingStatusDTO,
  type BuildingResponseDTO,
  type FloorResponseDTO,
  type RescheduleOptionsResponseDTO,
  type RoomResponseDTO,
  type SubjectResponseDTO,
  type TimetableActivityResponseDTO,
  type WeekDayDTO,
  type WeekParityDTO,
} from '@free-spot/api-client';
import {
  type ActivityReschedulingActivity,
  type ActivityReschedulingActivityType,
  type ActivityReschedulingBooking,
  type ActivityReschedulingBookingStatus,
  type ActivityReschedulingBuilding,
  type ActivityReschedulingFloor,
  type ActivityReschedulingOptionsResult,
  type ActivityReschedulingRoom,
  type ActivityReschedulingSubject,
} from '@free-spot/activity-rescheduling/domain';

import { WeekDay, WeekParity } from '@free-spot/shared/domain';

export function rescheduleOptionsDtoToDomain(dto: RescheduleOptionsResponseDTO): ActivityReschedulingOptionsResult {
  return {
    items: (dto.items ?? []).map((item) => ({
      activityId: item.activityId,
      freeSpots: item.freeSpots ?? 0,
    })),
  };
}

export function bookingDtoToDomain(dto: BookingResponseDTO): ActivityReschedulingBooking {
  return {
    id: dto.id,
    activityId: dto.activityId,
    userId: dto.userId,
    facultyId: dto.facultyId ?? null,
    programId: dto.programId ?? null,
    programYearId: dto.programYearId ?? null,
    groupCohortId: dto.groupCohortId ?? null,
    semigroupCohortId: dto.semigroupCohortId ?? null,
    subjectId: dto.subjectId ?? null,
    activityType: toActivityType(dto.activityType),
    status: toBookingStatus(dto.status),
    originalActivityId: dto.originalActivityId ?? null,
    isRescheduled: dto.isRescheduled ?? null,
    rescheduledAt: dto.rescheduledAt ?? null,
    createdAt: dto.createdAt ?? null,
    updatedAt: dto.updatedAt ?? null,
  };
}

export function subjectDtoToDomain(dto: SubjectResponseDTO): ActivityReschedulingSubject {
  return {
    id: dto.id,
    name: dto.name,
    shortName: dto.shortName,
  };
}

export function timetableActivityDtoToDomain(dto: TimetableActivityResponseDTO): ActivityReschedulingActivity {
  return {
    id: dto.id,
    roomId: dto.roomId,
    subjectId: dto.subjectId,
    date: dto.date,
    weekDay: toWeekDay(dto.weekDay),
    activityType: toActivityType(dto.activityType),
    cohortIds: dto.cohortIds ?? [],
    startHour: dto.startHour,
    endHour: dto.endHour,
    weekParity: toWeekParity(dto.weekParity),
    capacity: dto.capacity,
    reservedSpots: dto.reservedSpots,
    busySpots: dto.busySpots,
    freeSpots: dto.freeSpots,
  };
}

export function roomDtoToDomain(dto: RoomResponseDTO): ActivityReschedulingRoom {
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

export function buildingDtoToDomain(dto: BuildingResponseDTO): ActivityReschedulingBuilding {
  return {
    id: dto.id,
    name: dto.name,
    address: dto.address,
  };
}

export function floorDtoToDomain(dto: FloorResponseDTO): ActivityReschedulingFloor {
  return {
    id: dto.id,
    buildingId: dto.buildingId,
    name: dto.name,
  };
}

function toActivityType(value: ActivityTypeDTO | undefined): ActivityReschedulingActivityType {
  if (!value) {
    throw new Error('Missing activity type');
  }

  return value;
}

function toBookingStatus(value: BookingStatusDTO | undefined): ActivityReschedulingBookingStatus {
  if (!value) {
    throw new Error('Missing booking status');
  }

  return value;
}

function toWeekDay(value: WeekDayDTO | undefined): WeekDay {
  if (!value) {
    throw new Error('Missing week day');
  }

  return value;
}

function toWeekParity(value: WeekParityDTO | undefined): WeekParity {
  if (!value) {
    throw new Error('Missing week parity');
  }

  return value;
}
