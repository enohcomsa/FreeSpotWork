import { FloorCardVM } from "./floor-card.vm";
import { Floor } from '@free-spot-domain/floor';

export function toFloorCardVM(floor: Floor): FloorCardVM {
  return {
    id: floor.id,
    name: floor.name,
    roomsCount: 0
  };
}
