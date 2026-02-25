export type CreateFloorCmd = {
  buildingId: string;
  name: string;
};

export type UpdateFloorCmd = Partial<CreateFloorCmd>;
