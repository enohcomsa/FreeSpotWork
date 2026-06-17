export type BuildingFloorCardVm = {
  name: string;
};

export type BuildingCardVm = {
  id: string;
  name: string;
  address: string;
  floors: BuildingFloorCardVm[];
};
