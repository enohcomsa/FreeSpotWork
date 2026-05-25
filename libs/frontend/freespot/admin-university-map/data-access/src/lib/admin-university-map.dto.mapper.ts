import {
  BuildingCreateDTO,
  BuildingResponseDTO,
  BuildingsCardResponseDTO,
  BuildingUpdateDTO,
  FloorCreateDTO,
  FloorResponseDTO,
  FloorUpdateDTO,
  RoomResponseDTO,
  RoomCreateDTO,
  RoomUpdateDTO,
  ActivityTypeDTO,
  SubjectResponseDTO,
  TimetableActivityResponseDTO,
  WeekDayDTO,
  WeekParityDTO,
  TimetableActivityCreateDTO,
} from '@free-spot/api-client';

import {
  AdminUniversityMapBuilding,
  AdminUniversityMapBuildingCard,
  AdminUniversityMapFloorCard,
  CreateAdminUniversityMapBuildingCmd,
  UpdateAdminUniversityMapBuildingCmd,
  AdminUniversityMapFloor,
  AdminUniversityMapRoom,
  CreateAdminUniversityMapFloorCmd,
  UpdateAdminUniversityMapFloorCmd,
  CreateAdminUniversityMapRoomCmd,
  UpdateAdminUniversityMapRoomCmd,
  AdminUniversityMapActivityType,
  AdminUniversityMapSubject,
  AdminUniversityMapTimetableActivity,
  AdminUniversityMapWeekDay,
  AdminUniversityMapWeekParity,
  CreateAdminUniversityMapTimetableActivityCmd,
} from '@free-spot/admin-university-map/domain';

export function mapAdminUniversityMapBuildingDtoToDomain(
  dto: BuildingResponseDTO,
): AdminUniversityMapBuilding {
  return {
    id: dto.id,
    name: dto.name,
    address: dto.address,
  };
}

export function mapAdminUniversityMapBuildingCardDtoToDomain(
  dto: BuildingsCardResponseDTO,
): AdminUniversityMapBuildingCard {
  return {
    id: dto.id,
    name: dto.name,
    address: dto.address,
    floors: dto.floors.map(mapAdminUniversityMapFloorCardDtoToDomain),
  };
}

export function mapAdminUniversityMapFloorCardDtoToDomain(
  dto: { name: string; total: number; unavailable: number },
): AdminUniversityMapFloorCard {
  return {
    name: dto.name,
    total: dto.total,
    unavailable: dto.unavailable,
  };
}

export function mapCreateAdminUniversityMapBuildingCmdToDto(
  cmd: CreateAdminUniversityMapBuildingCmd,
): BuildingCreateDTO {
  return {
    name: cmd.name,
    address: cmd.address,
  };
}

export function mapUpdateAdminUniversityMapBuildingCmdToDto(
  cmd: UpdateAdminUniversityMapBuildingCmd,
): BuildingUpdateDTO {
  return {
    name: cmd.name,
    address: cmd.address,
  };
}

export function mapAdminUniversityMapFloorDtoToDomain(
  dto: FloorResponseDTO,
): AdminUniversityMapFloor {
  return {
    id: dto.id,
    buildingId: dto.buildingId,
    name: dto.name,
  };
}

export function mapAdminUniversityMapRoomDtoToDomain(
  dto: RoomResponseDTO,
): AdminUniversityMapRoom {
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

export function mapCreateAdminUniversityMapFloorCmdToDto(
  cmd: CreateAdminUniversityMapFloorCmd,
): FloorCreateDTO {
  return {
    buildingId: cmd.buildingId,
    name: cmd.name,
  };
}

export function mapUpdateAdminUniversityMapFloorCmdToDto(
  cmd: UpdateAdminUniversityMapFloorCmd,
): FloorUpdateDTO {
  return {
    buildingId: cmd.buildingId,
    name: cmd.name,
  };
}

export function mapCreateAdminUniversityMapRoomCmdToDto(
  cmd: CreateAdminUniversityMapRoomCmd,
): RoomCreateDTO {
  return {
    buildingId: cmd.buildingId,
    floorId: cmd.floorId,
    name: cmd.name,
    totalSpotsNumber: cmd.totalSpotsNumber,
    unavailableSpots: cmd.unavailableSpots,
    subjectList: cmd.subjectList,
  };
}

export function mapUpdateAdminUniversityMapRoomCmdToDto(
  cmd: UpdateAdminUniversityMapRoomCmd,
): RoomUpdateDTO {
  return {
    buildingId: cmd.buildingId,
    floorId: cmd.floorId,
    name: cmd.name,
    totalSpotsNumber: cmd.totalSpotsNumber,
    unavailableSpots: cmd.unavailableSpots,
    subjectList: cmd.subjectList,
  };
}

export function mapAdminUniversityMapSubjectDtoToDomain(
  dto: SubjectResponseDTO,
): AdminUniversityMapSubject {
  return {
    id: dto.id,
    name: dto.name,
    shortName: dto.shortName,
  };
}

export function mapAdminUniversityMapTimetableActivityDtoToDomain(
  dto: TimetableActivityResponseDTO,
): AdminUniversityMapTimetableActivity {
  return {
    id: dto.id,
    roomId: dto.roomId,
    subjectId: dto.subjectId,
    weekDay: mapWeekDayDtoToDomain(dto.weekDay),
    startHour: dto.startHour,
    endHour: dto.endHour,
    weekParity: mapWeekParityDtoToDomain(dto.weekParity),
    activityType: mapActivityTypeDtoToDomain(dto.activityType),
  };
}

function mapActivityTypeDtoToDomain(dto: ActivityTypeDTO): AdminUniversityMapActivityType {
  switch (dto) {
    case ActivityTypeDTO.LABORATORY:
      return AdminUniversityMapActivityType.Laboratory;
    case ActivityTypeDTO.COURSE:
      return AdminUniversityMapActivityType.Course;
    case ActivityTypeDTO.PROJECT:
      return AdminUniversityMapActivityType.Project;
    case ActivityTypeDTO.SEMINAR:
      return AdminUniversityMapActivityType.Seminar;
    case ActivityTypeDTO.SPECIAL_EVENT:
      return AdminUniversityMapActivityType.SpecialEvent;
  }
}

function mapWeekDayDtoToDomain(dto: WeekDayDTO): AdminUniversityMapWeekDay {
  switch (dto) {
    case WeekDayDTO.MONDAY:
      return AdminUniversityMapWeekDay.Monday;
    case WeekDayDTO.TUESDAY:
      return AdminUniversityMapWeekDay.Tuesday;
    case WeekDayDTO.WEDNESDAY:
      return AdminUniversityMapWeekDay.Wednesday;
    case WeekDayDTO.THURSDAY:
      return AdminUniversityMapWeekDay.Thursday;
    case WeekDayDTO.FRIDAY:
      return AdminUniversityMapWeekDay.Friday;
    case WeekDayDTO.SATURDAY:
      return AdminUniversityMapWeekDay.Saturday;
    case WeekDayDTO.SUNDAY:
      return AdminUniversityMapWeekDay.Sunday;
  }
}

function mapWeekParityDtoToDomain(dto: WeekParityDTO): AdminUniversityMapWeekParity {
  switch (dto) {
    case WeekParityDTO.BOTH:
      return AdminUniversityMapWeekParity.Both;
    case WeekParityDTO.EVEN:
      return AdminUniversityMapWeekParity.Even;
    case WeekParityDTO.ODD:
      return AdminUniversityMapWeekParity.Odd;
  }
}

export function mapCreateAdminUniversityMapTimetableActivityCmdToDto(
  cmd: CreateAdminUniversityMapTimetableActivityCmd,
): TimetableActivityCreateDTO {
  return {
    roomId: cmd.roomId,
    subjectId: cmd.subjectId,
    date: cmd.date,
    weekDay: mapWeekDayDomainToDto(cmd.weekDay),
    activityType: mapActivityTypeDomainToDto(cmd.activityType),
    cohortIds: cmd.cohortIds,
    startHour: cmd.startHour,
    endHour: cmd.endHour,
    weekParity: mapWeekParityDomainToDto(cmd.weekParity),
    capacity: cmd.capacity,
    reservedSpots: cmd.reservedSpots,
    busySpots: cmd.busySpots,
    freeSpots: cmd.freeSpots,
  };
}

function mapActivityTypeDomainToDto(
  domain: AdminUniversityMapActivityType,
): ActivityTypeDTO {
  switch (domain) {
    case AdminUniversityMapActivityType.Laboratory:
      return ActivityTypeDTO.LABORATORY;
    case AdminUniversityMapActivityType.Course:
      return ActivityTypeDTO.COURSE;
    case AdminUniversityMapActivityType.Project:
      return ActivityTypeDTO.PROJECT;
    case AdminUniversityMapActivityType.Seminar:
      return ActivityTypeDTO.SEMINAR;
    case AdminUniversityMapActivityType.SpecialEvent:
      return ActivityTypeDTO.SPECIAL_EVENT;
  }
}

function mapWeekDayDomainToDto(
  domain: AdminUniversityMapWeekDay,
): WeekDayDTO {
  switch (domain) {
    case AdminUniversityMapWeekDay.Monday:
      return WeekDayDTO.MONDAY;
    case AdminUniversityMapWeekDay.Tuesday:
      return WeekDayDTO.TUESDAY;
    case AdminUniversityMapWeekDay.Wednesday:
      return WeekDayDTO.WEDNESDAY;
    case AdminUniversityMapWeekDay.Thursday:
      return WeekDayDTO.THURSDAY;
    case AdminUniversityMapWeekDay.Friday:
      return WeekDayDTO.FRIDAY;
    case AdminUniversityMapWeekDay.Saturday:
      return WeekDayDTO.SATURDAY;
    case AdminUniversityMapWeekDay.Sunday:
      return WeekDayDTO.SUNDAY;
  }
}

function mapWeekParityDomainToDto(
  domain: AdminUniversityMapWeekParity,
): WeekParityDTO {
  switch (domain) {
    case AdminUniversityMapWeekParity.Both:
      return WeekParityDTO.BOTH;
    case AdminUniversityMapWeekParity.Even:
      return WeekParityDTO.EVEN;
    case AdminUniversityMapWeekParity.Odd:
      return WeekParityDTO.ODD;
  }
}
