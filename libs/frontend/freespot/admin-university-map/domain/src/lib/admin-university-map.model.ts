export interface AdminUniversityMapBuilding {
  id: string;
  name: string;
  address: string;
}

export interface CreateAdminUniversityMapBuildingCmd {
  name: string;
  address: string;
}

export interface UpdateAdminUniversityMapBuildingCmd {
  name?: string;
  address?: string;
}

export interface AdminUniversityMapFloor {
  id: string;
  buildingId: string;
  name: string;
}

export interface CreateAdminUniversityMapFloorCmd {
  buildingId: string;
  name: string;
}

export interface UpdateAdminUniversityMapFloorCmd {
  buildingId?: string;
  name?: string;
}

export interface AdminUniversityMapRoom {
  id: string;
  buildingId: string;
  floorId: string;
  name: string;
  totalSpotsNumber: number;
  unavailableSpots: number;
  subjectList: string[];
}

export interface CreateAdminUniversityMapRoomCmd {
  buildingId: string;
  floorId: string;
  name: string;
  totalSpotsNumber: number;
  unavailableSpots: number;
  subjectList: string[];
}

export interface UpdateAdminUniversityMapRoomCmd {
  buildingId?: string;
  floorId?: string;
  name?: string;
  totalSpotsNumber?: number;
  unavailableSpots?: number;
  subjectList?: string[];
}

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

