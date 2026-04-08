import { BookingResponseDTO, BookingRescheduleDTO } from '@free-spot/api-client';
import { dtoToBookingStatus } from './booking-status.dto.mapper';
import { Booking, RescheduleBookingCmd } from '@free-spot-domain/booking';
import { dtoToActivityType } from '@http-free-spot/timetable-activity';

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
    activityType: dtoToActivityType(dto.activityType),
    status: dto.status ? dtoToBookingStatus(dto.status) : 'WAITLISTED',
    originalActivityId: dto.originalActivityId ?? null,
    isRescheduled: dto.isRescheduled ?? null,
    rescheduledAt: dto.rescheduledAt ?? null,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt ?? null,
  };
}

export function toRescheduleUpdateDTO(input: RescheduleBookingCmd): BookingRescheduleDTO {
  return {
    activityId: input.activityId,
  };
}
