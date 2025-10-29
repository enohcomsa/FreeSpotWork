import { Room } from '@free-spot-domain/room';
import { RoomCardVM } from "./room-card.vm";

export function toRoomCardVM(room: Room): RoomCardVM {
  return {
    name: room.name,
    totalSpotsNumber: room.totalSpotsNumber,
    unavailableSpots: room.unavailableSpots,
    id: room.id,
  };
}
