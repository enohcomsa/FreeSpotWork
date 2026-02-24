
import { BuildingCardFloorVM, BuildingCardVM } from './building-card.vm';
import { BuildingCardFloorDTO, BuildingsCardResponseDTO } from "@free-spot/api-client";


export function toBuildingCardVM(building: BuildingsCardResponseDTO): BuildingCardVM {
  return {
    id: building.id,
    name: building.name,
    address: building.address,
    floors: building.floors.map(toBuildingCardFloorVM),
  };
}

export function toBuildingCardFloorVM(floor: BuildingCardFloorDTO): BuildingCardFloorVM {
  return {
    name: floor.name,
    total: floor.total,
    unavailable: floor.unavailable,
  };
}
