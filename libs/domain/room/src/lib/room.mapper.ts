import { RoomCreateDTO, RoomResponseDTO, RoomUpdateDTO } from '@free-spot/api-client';
import { CreateRoomCmd, UpdateRoomCmd } from './room.commands';
import { Room } from './room.model';




export function dtoToDomain(dto: RoomResponseDTO): Room {
  return {
    buildingId: dto.buildingId,
    floorId: dto.floorId,
    name: dto.name,
    totalSpotsNumber: dto.totalSpotsNumber,
    unavailableSpots: dto.unavailableSpots,
    subjectList: dto.subjectList,
    id: dto.id,
  };
}

export function toCreateDTO(cmd: CreateRoomCmd): RoomCreateDTO {
  return {
    buildingId: cmd.buildingId,
    floorId: cmd.floorId,
    name: cmd.name,
    totalSpotsNumber: cmd.totalSpotsNumber,
    unavailableSpots: cmd.unavailableSpots,
    subjectList: cmd.subjectList,
  };
}

export function toUpdateDTO(cmd: UpdateRoomCmd): RoomUpdateDTO {
  return {
    buildingId: cmd.buildingId,
    floorId: cmd.floorId,
    name: cmd.name,
    totalSpotsNumber: cmd.totalSpotsNumber,
    unavailableSpots: cmd.unavailableSpots,
    subjectList: cmd.subjectList,
  };
}
