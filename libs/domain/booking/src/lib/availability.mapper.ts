import { RescheduleOptionsResponseDTO } from '@free-spot/api-client';
import { ActivityType } from '@free-spot/enums';
import {
  CurrentBookingForReschedule,
  RescheduleOption,
  RescheduleOptionsResult,
} from './availability.model';

function mapActivityType(value: string | undefined): ActivityType {
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

function mapCurrentBooking(dto: NonNullable<RescheduleOptionsResponseDTO['currentBooking']>): CurrentBookingForReschedule {
  if (!dto.id) throw new Error('currentBooking.id is missing');
  if (!dto.activityId) throw new Error('currentBooking.activityId is missing');

  return {
    id: dto.id,
    activityId: dto.activityId,
    subjectId: dto.subjectId ?? null,
    activityType: mapActivityType(dto.activityType),
    programYearId: dto.programYearId ?? null,
    groupCohortId: dto.groupCohortId ?? null,
    semigroupCohortId: dto.semigroupCohortId ?? null,
    originalActivityId: dto.originalActivityId ?? null,
    isRescheduled: dto.isRescheduled ?? null,
    rescheduledAt: dto.rescheduledAt ?? null,
  };
}

function mapOption(dto: RescheduleOptionsResponseDTO['items'][number]): RescheduleOption {
  if (!dto.activityId) throw new Error('reschedule option activityId is missing');
  if (!dto.subjectId) throw new Error('reschedule option subjectId is missing');
  if (!dto.date) throw new Error('reschedule option date is missing');

  return {
    activityId: dto.activityId,
    subjectId: dto.subjectId,
    activityType: mapActivityType(dto.activityType),
    date: dto.date,
    weekDay: dto.weekDay ?? '',
    startHour: dto.startHour ?? 0,
    endHour: dto.endHour ?? 0,
    capacity: dto.capacity ?? 0,
    reservedSpots: dto.reservedSpots ?? 0,
    busySpots: dto.busySpots ?? 0,
    freeSpots: dto.freeSpots ?? 0,
    cohortIds: dto.cohortIds ?? [],
  };
}

export function rescheduleOptionsDtoToDomain(dto: RescheduleOptionsResponseDTO): RescheduleOptionsResult {
  if (!dto.currentBooking) {
    throw new Error('reschedule options currentBooking is missing');
  }

  return {
    currentBooking: mapCurrentBooking(dto.currentBooking),
    items: (dto.items ?? []).map(mapOption),
    total: dto.total ?? 0,
  };
}
