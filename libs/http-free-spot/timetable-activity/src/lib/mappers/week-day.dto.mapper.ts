import { WeekDay } from "@free-spot/academic-schedule/domain";
import { WeekDayDTO } from "@free-spot/api-client";

export const dtoToWeekDay = (dto: WeekDayDTO): WeekDay => dto as unknown as WeekDay;
export const WeekDayToDto = (value: WeekDay): WeekDayDTO => value as unknown as WeekDayDTO;
