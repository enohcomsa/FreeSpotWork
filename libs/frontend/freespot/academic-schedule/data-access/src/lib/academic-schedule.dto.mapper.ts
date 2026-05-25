import {
  type ActivityTypeDTO,
  type RoomResponseDTO,
  type SubjectResponseDTO,
  type TimetableActivityResponseDTO,
  type WeekDayDTO,
  type WeekParityDTO,
} from '@free-spot/api-client';
import {
  type AcademicScheduleRoom,
  type AcademicScheduleSubject,
  type ActivityType,
  type TimetableActivity,
  type WeekDay,
  type WeekParity,
} from '@free-spot/academic-schedule/domain';

export function timetableActivityDtoToDomain(dto: TimetableActivityResponseDTO): TimetableActivity {
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

export function subjectDtoToDomain(dto: SubjectResponseDTO): AcademicScheduleSubject {
  return {
    id: dto.id,
    name: dto.name,
    shortName: dto.shortName,
  };
}

export function roomDtoToDomain(dto: RoomResponseDTO): AcademicScheduleRoom {
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

function toActivityType(value: ActivityTypeDTO | undefined): ActivityType {
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
