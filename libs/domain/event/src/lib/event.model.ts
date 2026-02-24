import { EventTypeDTO } from '@free-spot/api-client';

export interface SpecialEvent {
  id: string;
  type?: EventTypeDTO;
  name: string;
  date: string | null;
  startHour: number;
  buildingId: string;
  roomId: string;
  reservedSpots: number;
}
