import { EventTypeDTO } from "@free-spot/api-client";

export type CreateSpecialEventCmd = {
  type?: EventTypeDTO;
  name: string;
  date: string | null;
  startHour: number;
  buildingId: string;
  roomId: string;
  reservedSpots: number;
};

export type UpdateSpecialEventCmd = Partial<CreateSpecialEventCmd>;
