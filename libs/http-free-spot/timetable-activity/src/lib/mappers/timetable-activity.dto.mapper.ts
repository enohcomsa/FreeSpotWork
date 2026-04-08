import { CreateTimetableActivityCmd, TimetableActivity, UpdateTimetableActivityCmd } from "@free-spot-domain/timetable-activity";
import { TimetableActivityCreateDTO, TimetableActivityResponseDTO, TimetableActivityUpdateDTO } from "@free-spot/api-client";
import { dtoToWeekDay, WeekDayToDto as weekDayToDto } from "./week-day.dto.mapper";
import { ActivityTypeToDto as activityTypeToDto, dtoToActivityType } from "./activity-type.dto.mapper";
import { dtoToWeekParity, WeekParityToDto as weekParityToDto } from "./week-parity.dto.mapper";


export function dtoToDomain(dto: TimetableActivityResponseDTO): TimetableActivity {
  return {
    roomId: dto.roomId,
    subjectId: dto.subjectId,
    date: dto.date,
    weekDay: dtoToWeekDay(dto.weekDay),
    activityType: dtoToActivityType(dto.activityType),
    cohortIds: dto.cohortIds,
    startHour: dto.startHour,
    endHour: dto.endHour,
    weekParity: dtoToWeekParity(dto.weekParity),
    capacity: dto.capacity,
    reservedSpots: dto.reservedSpots,
    busySpots: dto.busySpots,
    freeSpots: dto.freeSpots,
    id: dto.id,
  };
}

export function toCreateDTO(cmd: CreateTimetableActivityCmd): TimetableActivityCreateDTO {
  return {
    roomId: cmd.roomId,
    subjectId: cmd.subjectId,
    date: cmd.date,
    weekDay: weekDayToDto(cmd.weekDay),
    activityType: activityTypeToDto(cmd.activityType),
    cohortIds: cmd.cohortIds,
    startHour: cmd.startHour,
    endHour: cmd.endHour,
    weekParity: weekParityToDto(cmd.weekParity),
    capacity: cmd.capacity,
    reservedSpots: cmd.reservedSpots,
    busySpots: cmd.busySpots,
    freeSpots: cmd.freeSpots,
  };
}

export function toUpdateDTO(cmd: UpdateTimetableActivityCmd): TimetableActivityUpdateDTO {
  return {
    roomId: cmd.roomId,
    subjectId: cmd.subjectId,
    date: cmd.date,
    weekDay: cmd.weekDay ? weekDayToDto(cmd.weekDay) : undefined,
    activityType: cmd.activityType ? activityTypeToDto(cmd.activityType) : undefined,
    cohortIds: cmd.cohortIds,
    startHour: cmd.startHour,
    endHour: cmd.endHour,
    weekParity: cmd.weekParity ? weekParityToDto(cmd.weekParity) : undefined,
    capacity: cmd.capacity,
    reservedSpots: cmd.reservedSpots,
    busySpots: cmd.busySpots,
    freeSpots: cmd.freeSpots,
  };
}

