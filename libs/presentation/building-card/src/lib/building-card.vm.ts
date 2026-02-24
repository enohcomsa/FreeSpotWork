export interface BuildingCardFloorVM {
  name: string;
  total: number;
  unavailable: number;
}

export interface BuildingCardVM {
  id: string;
  name: string;
  address: string;
  floors: BuildingCardFloorVM[];
}

