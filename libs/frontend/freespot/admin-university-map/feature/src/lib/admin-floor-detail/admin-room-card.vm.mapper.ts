import { type AdminUniversityMapRoom } from '@free-spot/admin-university-map/domain';
import { type AdminUniversityMapRoomVm } from '@free-spot/admin-university-map/ui';

export function toAdminUniversityMapRoomVm(room: AdminUniversityMapRoom): AdminUniversityMapRoomVm {
  return {
    id: room.id,
    name: room.name,
    totalSpotsNumber: room.totalSpotsNumber,
    unavailableSpots: room.unavailableSpots,
  };
}
