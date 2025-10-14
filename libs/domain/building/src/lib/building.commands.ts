export type CreateBuildingCmd = {
  name: string;
  address: string;
  specialEvent: boolean;
};

export type UpdateBuildingCmd = Partial<CreateBuildingCmd>;
