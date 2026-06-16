import { type UniversityMapRoom } from '@free-spot/university-map/domain';
import { type RoomCardVm } from '@free-spot/university-map/ui';

export function toRoomCardVm(room: UniversityMapRoom): RoomCardVm {
  return {
    id: room.id,
    name: room.name,
  };
}
