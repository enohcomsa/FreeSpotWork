import {
  CohortCreateDTO,
  CohortResponseDTO,
  CohortTypeDTO,
  DegreeDTO,
  FacultyResponseDTO,
  FacultyUpdateDTO,
  ProgramCreateDTO,
  ProgramResponseDTO,
  ProgramUpdateDTO,
  ProgramYearCreateDTO,
  ProgramYearResponseDTO,
  ProgramYearUpdateDTO,
  SubjectResponseDTO,
  ActivityTypeDTO,
  RoomResponseDTO,
  TimetableActivityResponseDTO,
  UserResponseDTO,
  UserUpdateDTO,
  WeekDayDTO,
  WeekParityDTO,
} from '@free-spot/api-client';

import {
  AdminAcademicCohortType,
  AdminAcademicDegreeType,
  AdminCohort,
  AdminFaculty,
  AdminProgram,
  AdminProgramYear,
  AdminSubjectItem,
  CreateAdminCohortCmd,
  CreateAdminProgramCmd,
  CreateAdminProgramYearCmd,
  UpdateAdminFacultyCmd,
  UpdateAdminProgramCmd,
  UpdateAdminProgramYearCmd,
  AdminAcademicActivityType,
  AdminAcademicRoom,
  AdminAcademicTimetableActivity,
  AdminAcademicUser,
  AdminAcademicWeekDay,
  AdminAcademicWeekParity,
  UpdateAdminAcademicUserCmd,
} from '@free-spot/admin-academic-structure/domain';

export function mapAdminFacultyDtoToDomain(dto: FacultyResponseDTO): AdminFaculty {
  return {
    id: dto.id,
    name: dto.name,
    subjectList: dto.subjectList,
  };
}

export function mapAdminSubjectDtoToDomain(dto: SubjectResponseDTO): AdminSubjectItem {
  return {
    id: dto.id,
    name: dto.name,
    shortName: dto.shortName,
  };
}

export function mapAdminProgramDtoToDomain(dto: ProgramResponseDTO): AdminProgram {
  return {
    id: dto.id,
    facultyId: dto.facultyId,
    name: dto.name,
    degree: mapDegreeDtoToDomain(dto.degree),
    active: dto.active,
  };
}

export function mapAdminProgramYearDtoToDomain(dto: ProgramYearResponseDTO): AdminProgramYear {
  return {
    id: dto.id,
    programId: dto.programId,
    label: dto.label,
    yearNumber: dto.yearNumber,
  };
}

export function mapAdminCohortDtoToDomain(dto: CohortResponseDTO): AdminCohort {
  return {
    id: dto.id,
    type: mapCohortTypeDtoToDomain(dto.type),
    programYearId: dto.programYearId,
    name: dto.name,
    parentGroupId: dto.parentGroupId ?? null,
  };
}

export function mapUpdateAdminFacultyCmdToDto(cmd: UpdateAdminFacultyCmd): FacultyUpdateDTO {
  return {
    subjectList: cmd.subjectList,
  };
}

export function mapCreateAdminProgramCmdToDto(cmd: CreateAdminProgramCmd): ProgramCreateDTO {
  return {
    facultyId: cmd.facultyId,
    name: cmd.name,
    degree: mapDegreeDomainToDto(cmd.degree),
    active: cmd.active,
  };
}

export function mapUpdateAdminProgramCmdToDto(cmd: UpdateAdminProgramCmd): ProgramUpdateDTO {
  return {
    facultyId: cmd.facultyId,
    name: cmd.name,
    degree: cmd.degree ? mapDegreeDomainToDto(cmd.degree) : undefined,
    active: cmd.active,
  };
}

export function mapCreateAdminProgramYearCmdToDto(cmd: CreateAdminProgramYearCmd): ProgramYearCreateDTO {
  return {
    programId: cmd.programId,
    label: cmd.label,
    yearNumber: cmd.yearNumber,
  };
}

export function mapUpdateAdminProgramYearCmdToDto(cmd: UpdateAdminProgramYearCmd): ProgramYearUpdateDTO {
  return {
    programId: cmd.programId,
    label: cmd.label,
    yearNumber: cmd.yearNumber,
  };
}

export function mapCreateAdminCohortCmdToDto(cmd: CreateAdminCohortCmd): CohortCreateDTO {
  return {
    type: mapCohortTypeDomainToDto(cmd.type),
    programYearId: cmd.programYearId,
    name: cmd.name,
    parentGroupId: cmd.parentGroupId ?? null,
  };
}

function mapDegreeDtoToDomain(dto: DegreeDTO): AdminAcademicDegreeType {
  switch (dto) {
    case DegreeDTO.LIC:
      return AdminAcademicDegreeType.Lic;
    case DegreeDTO.MASTER:
      return AdminAcademicDegreeType.Master;
    case DegreeDTO.DOCT:
      return AdminAcademicDegreeType.Doct;
  }
}

function mapDegreeDomainToDto(domain: AdminAcademicDegreeType): DegreeDTO {
  switch (domain) {
    case AdminAcademicDegreeType.Lic:
      return DegreeDTO.LIC;
    case AdminAcademicDegreeType.Master:
      return DegreeDTO.MASTER;
    case AdminAcademicDegreeType.Doct:
      return DegreeDTO.DOCT;
  }
}

function mapCohortTypeDtoToDomain(dto: CohortTypeDTO): AdminAcademicCohortType {
  switch (dto) {
    case CohortTypeDTO.GROUP:
      return AdminAcademicCohortType.Group;
    case CohortTypeDTO.SEMIGROUP:
      return AdminAcademicCohortType.Semigroup;
  }
}

function mapCohortTypeDomainToDto(domain: AdminAcademicCohortType): CohortTypeDTO {
  switch (domain) {
    case AdminAcademicCohortType.Group:
      return CohortTypeDTO.GROUP;
    case AdminAcademicCohortType.Semigroup:
      return CohortTypeDTO.SEMIGROUP;
  }
}

export function mapAdminAcademicUserDtoToDomain(dto: UserResponseDTO): AdminAcademicUser {
  return {
    id: dto.id,
    firstName: dto.firstName,
    familyName: dto.familyName,
    groupCohortId: dto.groupCohortId,
    semigroupCohortId: dto.semigroupCohortId,
  };
}

export function mapUpdateAdminAcademicUserCmdToDto(cmd: UpdateAdminAcademicUserCmd): UserUpdateDTO {
  return {
    groupCohortId: cmd.groupCohortId,
    semigroupCohortId: cmd.semigroupCohortId,
  };
}

export function mapAdminAcademicRoomDtoToDomain(dto: RoomResponseDTO): AdminAcademicRoom {
  return {
    id: dto.id,
    name: dto.name,
  };
}

export function mapAdminAcademicTimetableActivityDtoToDomain(
  dto: TimetableActivityResponseDTO,
): AdminAcademicTimetableActivity {
  return {
    id: dto.id,
    roomId: dto.roomId,
    subjectId: dto.subjectId,
    cohortIds: dto.cohortIds,
    weekDay: mapWeekDayDtoToDomain(dto.weekDay),
    startHour: dto.startHour,
    endHour: dto.endHour,
    weekParity: mapWeekParityDtoToDomain(dto.weekParity),
    activityType: mapActivityTypeDtoToDomain(dto.activityType),
  };
}

function mapActivityTypeDtoToDomain(dto: ActivityTypeDTO): AdminAcademicActivityType {
  switch (dto) {
    case ActivityTypeDTO.LABORATORY:
      return AdminAcademicActivityType.Laboratory;
    case ActivityTypeDTO.COURSE:
      return AdminAcademicActivityType.Course;
    case ActivityTypeDTO.PROJECT:
      return AdminAcademicActivityType.Project;
    case ActivityTypeDTO.SEMINAR:
      return AdminAcademicActivityType.Seminar;
    case ActivityTypeDTO.SPECIAL_EVENT:
      return AdminAcademicActivityType.SpecialEvent;
  }
}

function mapWeekDayDtoToDomain(dto: WeekDayDTO): AdminAcademicWeekDay {
  switch (dto) {
    case WeekDayDTO.MONDAY:
      return AdminAcademicWeekDay.Monday;
    case WeekDayDTO.TUESDAY:
      return AdminAcademicWeekDay.Tuesday;
    case WeekDayDTO.WEDNESDAY:
      return AdminAcademicWeekDay.Wednesday;
    case WeekDayDTO.THURSDAY:
      return AdminAcademicWeekDay.Thursday;
    case WeekDayDTO.FRIDAY:
      return AdminAcademicWeekDay.Friday;
    case WeekDayDTO.SATURDAY:
      return AdminAcademicWeekDay.Saturday;
    case WeekDayDTO.SUNDAY:
      return AdminAcademicWeekDay.Sunday;
  }
}

function mapWeekParityDtoToDomain(dto: WeekParityDTO): AdminAcademicWeekParity {
  switch (dto) {
    case WeekParityDTO.BOTH:
      return AdminAcademicWeekParity.Both;
    case WeekParityDTO.EVEN:
      return AdminAcademicWeekParity.Even;
    case WeekParityDTO.ODD:
      return AdminAcademicWeekParity.Odd;
  }
}
