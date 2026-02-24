import { EventCreateDTO, EventResponseDTO, EventUpdateDTO } from '@free-spot/api-client';
import { CreateSpecialEventCmd, UpdateSpecialEventCmd } from './event.commands';
import { SpecialEvent } from './event.model';


export function dtoToDomain(dto: EventResponseDTO): SpecialEvent {
  return {
    type: dto.type,
    name: dto.name,
    date: dto.date,
    startHour: dto.startHour,
    buildingId: dto.buildingId,
    roomId: dto.roomId,
    reservedSpots: dto.reservedSpots,
    id: dto.id,
  };
}

export function toCreateDTO(cmd: CreateSpecialEventCmd): EventCreateDTO {
  return {
    type: cmd.type,
    name: cmd.name,
    date: cmd.date,
    startHour: cmd.startHour,
    buildingId: cmd.buildingId,
    roomId: cmd.roomId,
    reservedSpots: cmd.reservedSpots,
  };
}

export function toUpdateDTO(cmd: UpdateSpecialEventCmd): EventUpdateDTO {
  return {
    type: cmd.type,
    name: cmd.name,
    date: cmd.date,
    startHour: cmd.startHour,
    buildingId: cmd.buildingId,
    roomId: cmd.roomId,
    reservedSpots: cmd.reservedSpots,
  };
}
