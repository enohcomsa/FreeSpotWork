import {
  ActivityTypeDTO,
  BookingResponseDTO,
  RoomResponseDTO,
  SubjectResponseDTO,
  TimetableActivityResponseDTO,
  TimetableActivityUpdateDTO,
  UserResponseDTO,
  UserUpdateDTO,
  WeekDayDTO,
  WeekParityDTO,
} from '@free-spot/api-client';

import {
  AdminTimetableActivity,
  AdminTimetableActivityType,
  AdminTimetableWeekDay,
  AdminTimetableWeekParity,
  AdminTimetablingBooking,
  AdminTimetablingRoom,
  AdminTimetablingSubject,
  AdminTimetablingUser,
  UpdateAdminTimetableActivityCmd,
  UpdateAdminTimetablingUserCmd,
} from '@free-spot/admin-timetabling/domain';

export function mapAdminTimetableActivityDtoToDomain(dto: TimetableActivityResponseDTO): AdminTimetableActivity {
  return {
    id: dto.id,
    roomId: dto.roomId,
    subjectId: dto.subjectId,
    date: dto.date,
    weekDay: mapWeekDayDtoToDomain(dto.weekDay),
    activityType: mapActivityTypeDtoToDomain(dto.activityType),
    cohortIds: dto.cohortIds,
    startHour: dto.startHour,
    endHour: dto.endHour,
    weekParity: mapWeekParityDtoToDomain(dto.weekParity),
    capacity: dto.capacity,
    reservedSpots: dto.reservedSpots,
    busySpots: dto.busySpots,
    freeSpots: dto.freeSpots,
  };
}

export function mapAdminTimetablingRoomDtoToDomain(dto: RoomResponseDTO): AdminTimetablingRoom {
  return {
    id: dto.id,
    name: dto.name,
    buildingId: dto.buildingId,
    floorId: dto.floorId,
    totalSpotsNumber: dto.totalSpotsNumber,
    unavailableSpots: dto.unavailableSpots,
    subjectList: dto.subjectList,
  };
}

export function mapAdminTimetablingSubjectDtoToDomain(dto: SubjectResponseDTO): AdminTimetablingSubject {
  return {
    id: dto.id,
    name: dto.name,
    shortName: dto.shortName,
  };
}

export function mapAdminTimetablingUserDtoToDomain(dto: UserResponseDTO): AdminTimetablingUser {
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

export function mapAdminTimetablingBookingDtoToDomain(dto: BookingResponseDTO): AdminTimetablingBooking {
  return {
    id: dto.id,
    activityId: dto.activityId,
    userId: dto.userId,
  };
}

export function mapUpdateAdminTimetableActivityCmdToDto(cmd: UpdateAdminTimetableActivityCmd): TimetableActivityUpdateDTO {
  return {
    roomId: cmd.roomId,
    subjectId: cmd.subjectId,
    date: cmd.date,
    weekDay: cmd.weekDay ? mapWeekDayDomainToDto(cmd.weekDay) : undefined,
    activityType: cmd.activityType ? mapActivityTypeDomainToDto(cmd.activityType) : undefined,
    cohortIds: cmd.cohortIds,
    startHour: cmd.startHour,
    endHour: cmd.endHour,
    weekParity: cmd.weekParity ? mapWeekParityDomainToDto(cmd.weekParity) : undefined,
    capacity: cmd.capacity,
    reservedSpots: cmd.reservedSpots,
    busySpots: cmd.busySpots,
    freeSpots: cmd.freeSpots,
  };
}

export function mapUpdateAdminTimetablingUserCmdToDto(cmd: UpdateAdminTimetablingUserCmd): UserUpdateDTO {
  return {
    groupCohortId: cmd.groupCohortId,
    semigroupCohortId: cmd.semigroupCohortId,
  };
}

function mapActivityTypeDtoToDomain(dto: ActivityTypeDTO): AdminTimetableActivityType {
  switch (dto) {
    case ActivityTypeDTO.LABORATORY:
      return AdminTimetableActivityType.Laboratory;
    case ActivityTypeDTO.COURSE:
      return AdminTimetableActivityType.Course;
    case ActivityTypeDTO.PROJECT:
      return AdminTimetableActivityType.Project;
    case ActivityTypeDTO.SEMINAR:
      return AdminTimetableActivityType.Seminar;
    case ActivityTypeDTO.SPECIAL_EVENT:
      return AdminTimetableActivityType.SpecialEvent;
  }
}

function mapActivityTypeDomainToDto(domain: AdminTimetableActivityType): ActivityTypeDTO {
  switch (domain) {
    case AdminTimetableActivityType.Laboratory:
      return ActivityTypeDTO.LABORATORY;
    case AdminTimetableActivityType.Course:
      return ActivityTypeDTO.COURSE;
    case AdminTimetableActivityType.Project:
      return ActivityTypeDTO.PROJECT;
    case AdminTimetableActivityType.Seminar:
      return ActivityTypeDTO.SEMINAR;
    case AdminTimetableActivityType.SpecialEvent:
      return ActivityTypeDTO.SPECIAL_EVENT;
  }
}

function mapWeekDayDtoToDomain(dto: WeekDayDTO): AdminTimetableWeekDay {
  switch (dto) {
    case WeekDayDTO.MONDAY:
      return AdminTimetableWeekDay.Monday;
    case WeekDayDTO.TUESDAY:
      return AdminTimetableWeekDay.Tuesday;
    case WeekDayDTO.WEDNESDAY:
      return AdminTimetableWeekDay.Wednesday;
    case WeekDayDTO.THURSDAY:
      return AdminTimetableWeekDay.Thursday;
    case WeekDayDTO.FRIDAY:
      return AdminTimetableWeekDay.Friday;
    case WeekDayDTO.SATURDAY:
      return AdminTimetableWeekDay.Saturday;
    case WeekDayDTO.SUNDAY:
      return AdminTimetableWeekDay.Sunday;
  }
}

function mapWeekDayDomainToDto(domain: AdminTimetableWeekDay): WeekDayDTO {
  switch (domain) {
    case AdminTimetableWeekDay.Monday:
      return WeekDayDTO.MONDAY;
    case AdminTimetableWeekDay.Tuesday:
      return WeekDayDTO.TUESDAY;
    case AdminTimetableWeekDay.Wednesday:
      return WeekDayDTO.WEDNESDAY;
    case AdminTimetableWeekDay.Thursday:
      return WeekDayDTO.THURSDAY;
    case AdminTimetableWeekDay.Friday:
      return WeekDayDTO.FRIDAY;
    case AdminTimetableWeekDay.Saturday:
      return WeekDayDTO.SATURDAY;
    case AdminTimetableWeekDay.Sunday:
      return WeekDayDTO.SUNDAY;
  }
}

function mapWeekParityDtoToDomain(dto: WeekParityDTO): AdminTimetableWeekParity {
  switch (dto) {
    case WeekParityDTO.BOTH:
      return AdminTimetableWeekParity.Both;
    case WeekParityDTO.EVEN:
      return AdminTimetableWeekParity.Even;
    case WeekParityDTO.ODD:
      return AdminTimetableWeekParity.Odd;
  }
}

function mapWeekParityDomainToDto(domain: AdminTimetableWeekParity): WeekParityDTO {
  switch (domain) {
    case AdminTimetableWeekParity.Both:
      return WeekParityDTO.BOTH;
    case AdminTimetableWeekParity.Even:
      return WeekParityDTO.EVEN;
    case AdminTimetableWeekParity.Odd:
      return WeekParityDTO.ODD;
  }
}
