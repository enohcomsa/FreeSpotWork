import { TimetableActivityResponseDTO } from '@free-spot/api-client';
import { ActivityType, TimetableActivity, WeekDay, WeekParity } from '@free-spot/academic-schedule/domain';
import { RoomResponseDTO, SubjectResponseDTO } from '@free-spot/api-client';
import {
  type AcademicScheduleRoom,
  type AcademicScheduleSubject,
} from '@free-spot/academic-schedule/domain';

export function timetableActivityDtoToDomain(dto: TimetableActivityResponseDTO): TimetableActivity {
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
    subjectList: dto.subjectList,
  };
}

function activityTypeDtoToDomain(value: string | undefined): ActivityType {
  switch (value) {
    case 'LABORATORY':
      return ActivityType.LABORATORY;
    case 'COURSE':
      return ActivityType.COURSE;
    case 'PROJECT':
      return ActivityType.PROJECT;
    case 'SEMINAR':
      return ActivityType.SEMINAR;
    case 'SPECIAL_EVENT':
      return ActivityType.SPECIAL_EVENT;
    default:
      return ActivityType.COURSE;
  }
}

function weekDayDtoToDomain(value: string | undefined): WeekDay {
  switch (value) {
    case 'MONDAY':
      return WeekDay.MONDAY;
    case 'TUESDAY':
      return WeekDay.TUESDAY;
    case 'WEDNESDAY':
      return WeekDay.WEDNESDAY;
    case 'THURSDAY':
      return WeekDay.THURSDAY;
    case 'FRIDAY':
      return WeekDay.FRIDAY;
    case 'SATURDAY':
      return WeekDay.SATURDAY;
    case 'SUNDAY':
      return WeekDay.SUNDAY;
    default:
      return WeekDay.MONDAY;
  }
}

function weekParityDtoToDomain(value: string | undefined): WeekParity {
  switch (value) {
    case 'ODD':
      return WeekParity.ODD;
    case 'EVEN':
      return WeekParity.EVEN;
    case 'BOTH':
      return WeekParity.BOTH;
    default:
      return WeekParity.BOTH;
  }
}
