export type CreateBuildingCmd = {
  name: string;
  address: string;
};

export type UpdateBuildingCmd = Partial<CreateBuildingCmd>;
