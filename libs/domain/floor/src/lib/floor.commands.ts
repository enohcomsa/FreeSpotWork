export type CreateFloorCmd = {
  buildingId: string;
  name: string;
  totalSpotsNumber: number;
  unavailableSpots: number;
};

export type UpdateFloorCmd = Partial<CreateFloorCmd>;
