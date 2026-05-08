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
