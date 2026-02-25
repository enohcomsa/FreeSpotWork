import { ActivityType, WeekDay, WeekParity } from "@free-spot/enums";
import { TimetableActivity } from "./timetable-activity.model";
import { ActivityTypeDTO, TimetableActivityCreateDTO, TimetableActivityResponseDTO, TimetableActivityUpdateDTO, WeekDayDTO, WeekParityDTO } from '@free-spot/api-client';
import { CreateTimetableActivityCmd, UpdateTimetableActivityCmd } from "./timetable-activity.commands";

export function dtoToDomain(dto: TimetableActivityResponseDTO): TimetableActivity {
  return {
    roomId: dto.roomId,
    subjectId: dto.subjectId,
    date: dto.date,
    weekDay: toWeekDay(dto.weekDay),
    activityType: toActivityType(dto.activityType),
    cohortIds: dto.cohortIds,
    startHour: dto.startHour,
    endHour: dto.endHour,
    weekParity: toWeekParity(dto.weekParity),
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
    weekDay: toWeekDayDTO(cmd.weekDay),
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

export function toUpdateDTO(cmd: UpdateTimetableActivityCmd): TimetableActivityUpdateDTO {
  return {
    roomId: cmd.roomId,
    subjectId: cmd.subjectId,
    date: cmd.date,
    weekDay: toWeekDayDTO(cmd.weekDay),
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

function toWeekDayDTO(weekDay: WeekDay): WeekDayDTO;
function toWeekDayDTO(weekDay: WeekDay | undefined): WeekDayDTO | undefined;
function toWeekDayDTO(weekDay: WeekDay | undefined): WeekDayDTO | undefined {
  if (weekDay === undefined) return undefined;
  return WeekDayDTO[weekDay as keyof typeof WeekDayDTO];
}
const toWeekDay = (weekDayDto: WeekDayDTO): WeekDay => WeekDay[weekDayDto as keyof typeof WeekDayDTO];

function toActivityTypeDto(activityType: ActivityType): ActivityTypeDTO;
function toActivityTypeDto(activityType: ActivityType | undefined): ActivityTypeDTO | undefined;
function toActivityTypeDto(activityType: ActivityType | undefined): ActivityTypeDTO | undefined {
  if (activityType === undefined) return undefined;
  return ActivityTypeDTO[activityType as keyof typeof ActivityTypeDTO];
}
const toActivityType = (activityTypeDto: ActivityTypeDTO): ActivityType => ActivityType[activityTypeDto as keyof typeof ActivityType];

function toWeekParityDto(weekParity: WeekParity): WeekParityDTO;
function toWeekParityDto(weekParity: WeekParity | undefined): WeekParityDTO | undefined;
function toWeekParityDto(weekParity: WeekParity | undefined): WeekParityDTO | undefined {
  if (weekParity === undefined) return undefined;
  return WeekParityDTO[weekParity as keyof typeof WeekParityDTO];
}
const toWeekParity = (weekParityDto: WeekParityDTO): WeekParity => WeekParity[weekParityDto as keyof typeof WeekParity];
