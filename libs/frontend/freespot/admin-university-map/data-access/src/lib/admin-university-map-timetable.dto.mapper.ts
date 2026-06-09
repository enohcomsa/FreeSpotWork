import {
  type ActivityTypeDTO,
  type SubjectResponseDTO,
  type TimetableActivityCreateDTO,
  type TimetableActivityResponseDTO,
  type WeekDayDTO,
  type WeekParityDTO,
} from '@free-spot/api-client';
import {
  type AdminUniversityMapActivityType,
  type AdminUniversityMapSubject,
  type AdminUniversityMapTimetableActivity,
  type CreateAdminUniversityMapTimetableActivityCmd,
} from '@free-spot/admin-university-map/domain';
import { WeekDay, WeekParity } from '@free-spot/shared/domain';

export function subjectDtoToDomain(dto: SubjectResponseDTO): AdminUniversityMapSubject {
  return {
    id: dto.id,
    name: dto.name,
    shortName: dto.shortName,
  };
}

export function timetableActivityDtoToDomain(dto: TimetableActivityResponseDTO): AdminUniversityMapTimetableActivity {
  return {
    id: dto.id,
    roomId: dto.roomId,
    subjectId: dto.subjectId,
    weekDay: toWeekDay(dto.weekDay),
    startHour: dto.startHour,
    endHour: dto.endHour,
    weekParity: toWeekParity(dto.weekParity),
    activityType: toActivityType(dto.activityType),
  };
}

export function createTimetableActivityCmdToDto(
  cmd: CreateAdminUniversityMapTimetableActivityCmd,
): TimetableActivityCreateDTO {
  return {
    roomId: cmd.roomId,
    subjectId: cmd.subjectId,
    date: cmd.date,
    weekDay: toWeekDayDto(cmd.weekDay),
    activityType: toActivityTypeDto(cmd.activityType),
    cohortIds: cmd.cohortIds,
    startHour: cmd.startHour,
    endHour: cmd.endHour,
    weekParity: toWeekParityDto(cmd.weekParity),
    capacity: cmd.capacity,
    reservedSpots: cmd.reservedSpots,
    busySpots: cmd.busySpots,
    freeSpots: cmd.freeSpots,
  };
}

function toActivityType(value: ActivityTypeDTO | undefined): AdminUniversityMapActivityType {
  if (!value) {
    throw new Error('Missing activity type');
  }

  return value as AdminUniversityMapActivityType;
}

function toActivityTypeDto(value: AdminUniversityMapActivityType): ActivityTypeDTO {
  return value as ActivityTypeDTO;
}

function toWeekDay(value: WeekDayDTO | undefined): WeekDay {
  if (!value) {
    throw new Error('Missing week day');
  }

  return value as WeekDay;
}

function toWeekDayDto(value: WeekDay): WeekDayDTO {
  return value as WeekDayDTO;
}

function toWeekParity(value: WeekParityDTO | undefined): WeekParity {
  if (!value) {
    throw new Error('Missing week parity');
  }

  return value as WeekParity;
}

function toWeekParityDto(value: WeekParity): WeekParityDTO {
  return value as WeekParityDTO;
}
