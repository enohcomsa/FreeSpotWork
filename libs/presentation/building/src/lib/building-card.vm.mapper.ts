import { Building } from '@free-spot-domain/building';
import { BuildingCardVM } from './building-card.vm';


export function toBuildingCardVM(building: Building): BuildingCardVM {
  return {
    id: building.id,
    name: building.name,
    address: building.address,
    floors: [],
    specialEvent: building.specialEvent
  };
}
