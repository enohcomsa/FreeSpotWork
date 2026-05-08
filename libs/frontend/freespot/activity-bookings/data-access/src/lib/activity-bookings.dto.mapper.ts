import {
  BookingResponseDTO,
  BuildingResponseDTO,
  FloorResponseDTO,
  RoomResponseDTO,
  SubjectResponseDTO,
  TimetableActivityResponseDTO,
} from '@free-spot/api-client';
import {
  ActivityBookingActivityType,
  ActivityBookingWeekDay,
  ActivityBookingWeekParity,
  type ActivityBooking,
  type ActivityBookingActivity,
  type ActivityBookingBuilding,
  type ActivityBookingFloor,
  type ActivityBookingRoom,
  type ActivityBookingSubject,
  type BookingStatus,
} from '@free-spot/activity-bookings/domain';


export function bookingDtoToDomain(dto: BookingResponseDTO): ActivityBooking {
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

export function roomDtoToDomain(dto: RoomResponseDTO): ActivityBookingRoom {
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

function activityTypeDtoToDomain(value: string | undefined): ActivityBookingActivityType {
  switch (value) {
    case 'LABORATORY':
      return ActivityBookingActivityType.LABORATORY;
    case 'COURSE':
      return ActivityBookingActivityType.COURSE;
    case 'PROJECT':
      return ActivityBookingActivityType.PROJECT;
    case 'SEMINAR':
      return ActivityBookingActivityType.SEMINAR;
    case 'SPECIAL_EVENT':
      return ActivityBookingActivityType.SPECIAL_EVENT;
    default:
      return ActivityBookingActivityType.COURSE;
  }
}

function weekDayDtoToDomain(value: string | undefined): ActivityBookingWeekDay {
  switch (value) {
    case 'MONDAY':
      return ActivityBookingWeekDay.MONDAY;
    case 'TUESDAY':
      return ActivityBookingWeekDay.TUESDAY;
    case 'WEDNESDAY':
      return ActivityBookingWeekDay.WEDNESDAY;
    case 'THURSDAY':
      return ActivityBookingWeekDay.THURSDAY;
    case 'FRIDAY':
      return ActivityBookingWeekDay.FRIDAY;
    case 'SATURDAY':
      return ActivityBookingWeekDay.SATURDAY;
    case 'SUNDAY':
      return ActivityBookingWeekDay.SUNDAY;
    default:
      return ActivityBookingWeekDay.MONDAY;
  }
}

function weekParityDtoToDomain(value: string | undefined): ActivityBookingWeekParity {
  switch (value) {
    case 'ODD':
      return ActivityBookingWeekParity.ODD;
    case 'EVEN':
      return ActivityBookingWeekParity.EVEN;
    case 'BOTH':
      return ActivityBookingWeekParity.BOTH;
    default:
      return ActivityBookingWeekParity.BOTH;
  }
}

function bookingStatusDtoToDomain(value: string | undefined): BookingStatus {
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
