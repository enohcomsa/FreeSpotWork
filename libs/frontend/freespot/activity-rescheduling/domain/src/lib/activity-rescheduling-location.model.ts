export interface ActivityReschedulingRoom {
  id: string;
  buildingId: string;
  floorId: string;
  name: string;
  totalSpotsNumber: number;
  unavailableSpots: number;
  subjectList: string[];
}

export interface ActivityReschedulingBuilding {
  id: string;
  name: string;
  address: string;
}

export interface ActivityReschedulingFloor {
  id: string;
  buildingId: string;
  name: string;
}
