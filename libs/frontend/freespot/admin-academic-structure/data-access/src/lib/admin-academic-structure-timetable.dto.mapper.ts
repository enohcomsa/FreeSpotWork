import {
  type ActivityTypeDTO,
  type RoomResponseDTO,
  type TimetableActivityResponseDTO,
  type WeekDayDTO,
  type WeekParityDTO,
} from '@free-spot/api-client';

import {
  type AdminAcademicActivityType,
  type AdminAcademicRoom,
  type AdminAcademicTimetableActivity,
} from '@free-spot/admin-academic-structure/domain';

import { WeekDay, WeekParity } from '@free-spot/shared/domain';

export function roomDtoToDomain(dto: RoomResponseDTO): AdminAcademicRoom {
  return {
    id: dto.id,
    name: dto.name,
  };
}

export function timetableActivityDtoToDomain(
  dto: TimetableActivityResponseDTO,
): AdminAcademicTimetableActivity {
  return {
    id: dto.id,
    roomId: dto.roomId,
    subjectId: dto.subjectId,
    cohortIds: dto.cohortIds ?? [],
    weekDay: toWeekDay(dto.weekDay),
    startHour: dto.startHour,
    endHour: dto.endHour,
    weekParity: toWeekParity(dto.weekParity),
    activityType: toActivityType(dto.activityType),
  };
}

function toActivityType(value: ActivityTypeDTO | undefined): AdminAcademicActivityType {
  if (!value) {
    throw new Error('Missing activity type');
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
