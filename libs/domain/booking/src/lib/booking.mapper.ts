import { BookingResponseDTO, BookingUpdateDTO } from '@free-spot/api-client';
import { Booking } from './booking.model';
import { RescheduleBookingCmd } from './booking.commands';
import { ActivityType, BookingStatus } from '@free-spot/enums';

function mapActivityType(value: BookingResponseDTO['activityType']): ActivityType {
  switch (value) {
    case 'LABORATORY':
    case 'COURSE':
    case 'PROJECT':
    case 'SEMINAR':
    case 'SPECIAL_EVENT':
      return ActivityType[value];
    default:
      throw new Error(`Unsupported activityType: ${String(value)}`);
  }
}

function mapBookingStatus(value: BookingResponseDTO['status']): BookingStatus {
  switch (value) {
    case 'CONFIRMED':
    case 'WAITLISTED':
      return value;
    default:
      throw new Error(`Unsupported booking status: ${String(value)}`);
  }
}

export function dtoToDomain(dto: BookingResponseDTO): Booking {
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
    activityType: mapActivityType(dto.activityType),
    status: mapBookingStatus(dto.status),
    originalActivityId: dto.originalActivityId ?? null,
    isRescheduled: dto.isRescheduled ?? null,
    rescheduledAt: dto.rescheduledAt ?? null,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt ?? null,
  };
}

export function toRescheduleUpdateDTO(input: RescheduleBookingCmd): BookingUpdateDTO {
  return {
    activityId: input.activityId,
  };
}
