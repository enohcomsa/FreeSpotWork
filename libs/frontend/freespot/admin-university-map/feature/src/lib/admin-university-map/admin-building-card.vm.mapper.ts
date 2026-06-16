import { type AdminUniversityMapBuildingCard } from '@free-spot/admin-university-map/domain';
import {
  type AdminUniversityMapBuildingCardVm,
  type AdminUniversityMapFloorCardVm,
} from '@free-spot/admin-university-map/ui';

export function toAdminUniversityMapBuildingCardVm(
  building: AdminUniversityMapBuildingCard,
): AdminUniversityMapBuildingCardVm {
  return {
    id: building.id,
    name: building.name,
    address: building.address,
    floors: building.floors.map(toAdminUniversityMapFloorCardVm),
  };
}

function toAdminUniversityMapFloorCardVm(floor: {
  name: string;
  total: number;
  unavailable: number;
}): AdminUniversityMapFloorCardVm {
  return {
    name: floor.name,
    total: floor.total,
    unavailable: floor.unavailable,
  };
}
