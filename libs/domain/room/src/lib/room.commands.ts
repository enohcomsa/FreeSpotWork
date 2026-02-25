export type CreateRoomCmd = {
  buildingId: string;
  floorId: string;
  name: string;
  totalSpotsNumber: number;
  unavailableSpots: number;
  subjectList: string[];
};

export type UpdateRoomCmd = Partial<CreateRoomCmd>;
