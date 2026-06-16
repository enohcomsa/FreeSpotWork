export interface UniversityMapRoom {
  id: string;
  name: string;
  floorId: string | null;
}

export interface UniversityMapFloor {
  id: string;
  name: string;
  buildingId: string | null;
}

export type BuildingFloorCard = {
  name: string;
};

export type BuildingCard = {
  id: string;
  name: string;
  address: string;
  floors: BuildingFloorCard[];
};
