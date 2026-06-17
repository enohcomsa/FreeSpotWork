import { type AdminUniversityMapFloor, type AdminUniversityMapRoom } from '@free-spot/admin-university-map/domain';
import { type AdminUniversityMapFloorVm } from '@free-spot/admin-university-map/ui';

export function toAdminUniversityMapFloorVm(
  floor: AdminUniversityMapFloor,
  rooms: AdminUniversityMapRoom[],
): AdminUniversityMapFloorVm {
  return {
    id: floor.id,
    name: floor.name,
    roomsCount: rooms.filter((room) => room.floorId === floor.id).length,
  };
}
