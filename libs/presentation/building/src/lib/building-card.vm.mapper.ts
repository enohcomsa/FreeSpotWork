import { Building } from '@free-spot-domain/building';
import { BuildingCardFloorVM, BuildingCardVM } from './building-card.vm';
import { Floor } from '@free-spot-domain/floor';


export function toBuildingCardVM(building: Building): BuildingCardVM {
  return {
    id: building.id,
    name: building.name,
    address: building.address,
    floors: [],
    specialEvent: building.specialEvent
  };
}

export function toBuildingCardFloorVM(floor: Floor): BuildingCardFloorVM {
  return {
    name: floor.name,
    total: floor.totalSpotsNumber,
    unavailable: floor.unavailableSpots,
  };
}
