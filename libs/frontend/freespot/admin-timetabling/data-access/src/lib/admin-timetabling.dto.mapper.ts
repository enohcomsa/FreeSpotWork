import {
  type ActivityTypeDTO,
  type BookingResponseDTO,
  type RoomResponseDTO,
  type SubjectResponseDTO,
  type TimetableActivityResponseDTO,
  type TimetableActivityUpdateDTO,
  type UserResponseDTO,
  type UserUpdateDTO,
  type WeekDayDTO,
  type WeekParityDTO,
} from '@free-spot/api-client';

import {
  type AdminTimetableActivity,
  type AdminTimetableActivityType,
  type AdminTimetableWeekDay,
  type AdminTimetableWeekParity,
  type AdminTimetablingBooking,
  type AdminTimetablingRoom,
  type AdminTimetablingSubject,
  type AdminTimetablingUser,
  type UpdateAdminTimetableActivityCmd,
  type UpdateAdminTimetablingUserCmd,
} from '@free-spot/admin-timetabling/domain';

export function timetableActivityDtoToDomain(dto: TimetableActivityResponseDTO): AdminTimetableActivity {
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

export function roomDtoToDomain(dto: RoomResponseDTO): AdminTimetablingRoom {
  return {
    id: dto.id,
    name: dto.name,
    buildingId: dto.buildingId,
    floorId: dto.floorId,
    totalSpotsNumber: dto.totalSpotsNumber,
    unavailableSpots: dto.unavailableSpots,
    subjectList: dto.subjectList ?? [],
  };
}

export function subjectDtoToDomain(dto: SubjectResponseDTO): AdminTimetablingSubject {
  return {
    id: dto.id,
    name: dto.name,
    shortName: dto.shortName,
  };
}

export function userDtoToDomain(dto: UserResponseDTO): AdminTimetablingUser {
  return {
    id: dto.id,
    email: dto.email,
    username: dto.username,
    firstName: dto.firstName,
    familyName: dto.familyName,
    facultyId: dto.facultyId,
    programId: dto.programId,
    programYearId: dto.programYearId,
    groupCohortId: dto.groupCohortId,
    semigroupCohortId: dto.semigroupCohortId,
  };
}

export function bookingDtoToDomain(dto: BookingResponseDTO): AdminTimetablingBooking {
  return {
    id: dto.id,
    activityId: dto.activityId,
    userId: dto.userId,
  };
}

export function updateTimetableActivityCmdToDto(cmd: UpdateAdminTimetableActivityCmd): TimetableActivityUpdateDTO {
  return {
    roomId: cmd.roomId,
    subjectId: cmd.subjectId,
    date: cmd.date,
    weekDay: cmd.weekDay ? toWeekDayDto(cmd.weekDay) : undefined,
    activityType: cmd.activityType ? toActivityTypeDto(cmd.activityType) : undefined,
    cohortIds: cmd.cohortIds,
    startHour: cmd.startHour,
    endHour: cmd.endHour,
    weekParity: cmd.weekParity ? toWeekParityDto(cmd.weekParity) : undefined,
    capacity: cmd.capacity,
    reservedSpots: cmd.reservedSpots,
    busySpots: cmd.busySpots,
    freeSpots: cmd.freeSpots,
  };
}

export function updateUserCmdToDto(cmd: UpdateAdminTimetablingUserCmd): UserUpdateDTO {
  return {
    groupCohortId: cmd.groupCohortId,
    semigroupCohortId: cmd.semigroupCohortId,
  };
}

function toActivityType(value: ActivityTypeDTO | undefined): AdminTimetableActivityType {
  if (!value) {
    throw new Error('Missing activity type');
  }

  return value as AdminTimetableActivityType;
}

function toActivityTypeDto(value: AdminTimetableActivityType): ActivityTypeDTO {
  return value as ActivityTypeDTO;
}

function toWeekDay(value: WeekDayDTO | undefined): AdminTimetableWeekDay {
  if (!value) {
    throw new Error('Missing week day');
  }

  return value as AdminTimetableWeekDay;
}

function toWeekDayDto(value: AdminTimetableWeekDay): WeekDayDTO {
  return value as WeekDayDTO;
}

function toWeekParity(value: WeekParityDTO | undefined): AdminTimetableWeekParity {
  if (!value) {
    throw new Error('Missing week parity');
  }

  return value as AdminTimetableWeekParity;
}

function toWeekParityDto(value: AdminTimetableWeekParity): WeekParityDTO {
  return value as WeekParityDTO;
}
