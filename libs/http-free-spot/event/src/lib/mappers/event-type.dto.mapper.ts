import { EventType } from "@free-spot-domain/event";
import { EventTypeDTO } from "@free-spot/api-client";

export const dtoToEventType = (dto: EventTypeDTO): EventType => dto as unknown as EventType;
export const eventTypeToDto = (value: EventType): EventTypeDTO => value as unknown as EventTypeDTO;
