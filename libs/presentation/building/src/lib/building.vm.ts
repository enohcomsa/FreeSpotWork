export interface BuildingCardFloorVM {
  name: string;
}

export interface BuildingCardVM {
  id: string;
  name: string;
  address: string;
  floors: BuildingCardFloorVM[];
}
