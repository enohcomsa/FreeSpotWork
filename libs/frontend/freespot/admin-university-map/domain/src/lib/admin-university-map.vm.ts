export interface AdminUniversityMapFloorCard {
  name: string;
  total: number;
  unavailable: number;
}

export interface AdminUniversityMapBuildingCard {
  id: string;
  name: string;
  address: string;
  floors: AdminUniversityMapFloorCard[];
}

export interface AdminUniversityMapFloorVM {
  id: string;
  name: string;
  roomsCount: number;
}

export interface AdminUniversityMapRoomVM {
  id: string;
  name: string;
  totalSpotsNumber: number;
  unavailableSpots: number;
}
