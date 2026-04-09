import { WeekParity } from "@frontend/freespot/schedule/domain";
import { WeekParityDTO } from "@free-spot/api-client";

export const dtoToWeekParity = (dto: WeekParityDTO): WeekParity => dto as unknown as WeekParity;
export const WeekParityToDto = (value: WeekParity): WeekParityDTO => value as unknown as WeekParityDTO;
