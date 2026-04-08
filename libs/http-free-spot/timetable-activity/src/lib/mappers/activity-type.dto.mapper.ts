import { ActivityType } from "@free-spot-domain/timetable-activity";
import { ActivityTypeDTO } from "@free-spot/api-client";

export const dtoToActivityType = (dto: ActivityTypeDTO): ActivityType => dto as unknown as ActivityType;
export const ActivityTypeToDto = (value: ActivityType): ActivityTypeDTO => value as unknown as ActivityTypeDTO;
