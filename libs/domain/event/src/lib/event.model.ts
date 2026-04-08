import { EventType } from "./event-type.enum";

export interface SpecialEvent {
  id: string;
  type?: EventType;
  name: string;
  date: string | null;
  startHour: number;
  buildingId: string;
  roomId: string;
  reservedSpots: number;
}
