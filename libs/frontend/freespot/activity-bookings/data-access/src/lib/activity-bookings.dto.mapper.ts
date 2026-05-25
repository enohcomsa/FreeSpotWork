import {
  type ActivityTypeDTO,
  type BookingResponseDTO,
  type BookingStatusDTO,
  type BuildingResponseDTO,
  type FloorResponseDTO,
  type RoomResponseDTO,
  type SubjectResponseDTO,
  type TimetableActivityResponseDTO,
  type WeekDayDTO,
  type WeekParityDTO,
} from '@free-spot/api-client';
import {
  type ActivityBooking,
  type ActivityBookingActivity,
  type ActivityBookingActivityType,
  type ActivityBookingBuilding,
  type ActivityBookingFloor,
  type ActivityBookingRoom,
  type ActivityBookingStatus,
  type ActivityBookingSubject,
  type ActivityBookingWeekDay,
  type ActivityBookingWeekParity,
} from '@free-spot/activity-bookings/domain';

export function bookingDtoToDomain(dto: BookingResponseDTO): ActivityBooking {
  if (!dto.id) {
    throw new Error('Missing booking id');
  }

  if (!dto.activityId) {
    throw new Error('Missing booking activity id');
  }

  if (!dto.userId) {
    throw new Error('Missing booking user id');
  }

  if (!dto.createdAt) {
    throw new Error('Missing booking created at');
  }

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
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt ?? null,
  };
}

export function subjectDtoToDomain(dto: SubjectResponseDTO): ActivityBookingSubject {
  return {
    id: dto.id,
    name: dto.name,
    shortName: dto.shortName,
  };
}

export function timetableActivityDtoToDomain(dto: TimetableActivityResponseDTO): ActivityBookingActivity {
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

export function roomDtoToDomain(dto: RoomResponseDTO): ActivityBookingRoom {
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

export function buildingDtoToDomain(dto: BuildingResponseDTO): ActivityBookingBuilding {
  return {
    id: dto.id,
    name: dto.name,
    address: dto.address,
  };
}

export function floorDtoToDomain(dto: FloorResponseDTO): ActivityBookingFloor {
  return {
    id: dto.id,
    buildingId: dto.buildingId,
    name: dto.name,
  };
}

function toActivityType(value: ActivityTypeDTO | undefined): ActivityBookingActivityType {
  if (!value) {
    throw new Error('Missing activity type');
  }

  return value;
}

function toWeekDay(value: WeekDayDTO | undefined): ActivityBookingWeekDay {
  if (!value) {
    throw new Error('Missing week day');
  }

  return value;
}

function toWeekParity(value: WeekParityDTO | undefined): ActivityBookingWeekParity {
  if (!value) {
    throw new Error('Missing week parity');
  }

  return value;
}

function toBookingStatus(value: BookingStatusDTO | undefined): ActivityBookingStatus {
  if (!value) {
    throw new Error('Missing booking status');
  }

  return value;
}
