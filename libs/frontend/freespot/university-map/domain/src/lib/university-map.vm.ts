export type RoomCardVm = {
  id: string;
  name: string;
};

export type BuildingCardVm = {
  id: string;
  name: string;
  address: string;
  floors: {
    name: string;
  }[];
};
