import {
  BookingResponseDTO,
  BuildingResponseDTO,
  FloorResponseDTO,
  RescheduleOptionsResponseDTO,
  RoomResponseDTO,
  SubjectResponseDTO,
  TimetableActivityResponseDTO,
} from '@free-spot/api-client';
import {
  ActivityReschedulingActivityType,
  ActivityReschedulingWeekDay,
  ActivityReschedulingWeekParity,
  type ActivityReschedulingActivity,
  type ActivityReschedulingBooking,
  type ActivityReschedulingBookingStatus,
  type ActivityReschedulingBuilding,
  type ActivityReschedulingFloor,
  type ActivityReschedulingOptionsResult,
  type ActivityReschedulingRoom,
  type ActivityReschedulingSubject,
} from '@free-spot/activity-rescheduling/domain';

export function rescheduleOptionsDtoToDomain(dto: RescheduleOptionsResponseDTO): ActivityReschedulingOptionsResult {
  return {
    items: (dto.items ?? [])
      .filter((item) => item.activityId)
      .map((item) => ({
        activityId: item.activityId as string,
        freeSpots: item.freeSpots ?? 0,
      })),
  };
}

export function bookingDtoToDomain(dto: BookingResponseDTO): ActivityReschedulingBooking {
  if (!dto.id) throw new Error('Booking dto.id is missing');
  if (!dto.activityId) throw new Error('Booking dto.activityId is missing');
  if (!dto.userId) throw new Error('Booking dto.userId is missing');
  if (!dto.createdAt) throw new Error('Booking dto.createdAt is missing');

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
    activityType: activityTypeDtoToDomain(dto.activityType),
    status: bookingStatusDtoToDomain(dto.status),
    originalActivityId: dto.originalActivityId ?? null,
    isRescheduled: dto.isRescheduled ?? null,
    rescheduledAt: dto.rescheduledAt ?? null,
    createdAt: dto.createdAt,
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
    weekDay: weekDayDtoToDomain(dto.weekDay),
    activityType: activityTypeDtoToDomain(dto.activityType),
    cohortIds: dto.cohortIds,
    startHour: dto.startHour,
    endHour: dto.endHour,
    weekParity: weekParityDtoToDomain(dto.weekParity),
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
    subjectList: dto.subjectList,
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

export function activityTypeDtoToDomain(value: string | undefined): ActivityReschedulingActivityType {
  switch (value) {
    case 'LABORATORY':
      return ActivityReschedulingActivityType.LABORATORY;
    case 'COURSE':
      return ActivityReschedulingActivityType.COURSE;
    case 'PROJECT':
      return ActivityReschedulingActivityType.PROJECT;
    case 'SEMINAR':
      return ActivityReschedulingActivityType.SEMINAR;
    case 'SPECIAL_EVENT':
      return ActivityReschedulingActivityType.SPECIAL_EVENT;
    default:
      return ActivityReschedulingActivityType.COURSE;
  }
}

function weekDayDtoToDomain(value: string | undefined): ActivityReschedulingWeekDay {
  switch (value) {
    case 'MONDAY':
      return ActivityReschedulingWeekDay.MONDAY;
    case 'TUESDAY':
      return ActivityReschedulingWeekDay.TUESDAY;
    case 'WEDNESDAY':
      return ActivityReschedulingWeekDay.WEDNESDAY;
    case 'THURSDAY':
      return ActivityReschedulingWeekDay.THURSDAY;
    case 'FRIDAY':
      return ActivityReschedulingWeekDay.FRIDAY;
    case 'SATURDAY':
      return ActivityReschedulingWeekDay.SATURDAY;
    case 'SUNDAY':
      return ActivityReschedulingWeekDay.SUNDAY;
    default:
      return ActivityReschedulingWeekDay.MONDAY;
  }
}

function weekParityDtoToDomain(value: string | undefined): ActivityReschedulingWeekParity {
  switch (value) {
    case 'ODD':
      return ActivityReschedulingWeekParity.ODD;
    case 'EVEN':
      return ActivityReschedulingWeekParity.EVEN;
    case 'BOTH':
      return ActivityReschedulingWeekParity.BOTH;
    default:
      return ActivityReschedulingWeekParity.BOTH;
  }
}

function bookingStatusDtoToDomain(value: string | undefined): ActivityReschedulingBookingStatus {
  switch (value) {
    case 'CONFIRMED':
      return 'CONFIRMED';
    case 'WAITLISTED':
      return 'WAITLISTED';
    case 'CANCELLED':
      return 'CANCELLED';
    default:
      return 'WAITLISTED';
  }
}
