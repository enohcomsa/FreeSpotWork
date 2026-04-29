export type BuildingCardVm = {
  id: string;
  name: string;
  address: string;
  floors: {
    name: string;
  }[];
};
