export interface AdminUniversityMapFloorCardVm {
  name: string;
  total: number;
  unavailable: number;
}

export interface AdminUniversityMapBuildingCardVm {
  id: string;
  name: string;
  address: string;
  floors: AdminUniversityMapFloorCardVm[];
}
