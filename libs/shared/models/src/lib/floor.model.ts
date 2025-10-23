import { Room } from './room.model';
/** @deprecated Firebase-era nested model; remove after migration */
export interface FloorLegacy {
  name: string;
  buildingName: string;
  roomList: Room[];
  totalSpotsNumber: number;
  unavailableSpots: number;
}
