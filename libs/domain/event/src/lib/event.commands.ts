import { EventType } from "./event-type.enum";

export type CreateSpecialEventCmd = {
  type?: EventType;
  name: string;
  date: string | null;
  startHour: number;
  buildingId: string;
  roomId: string;
  reservedSpots: number;
};

export type UpdateSpecialEventCmd = Partial<CreateSpecialEventCmd>;
