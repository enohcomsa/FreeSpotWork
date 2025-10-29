import { RoomLegacy } from './room.model';
/** @deprecated Firebase-era nested model; remove after migration */
export interface FloorLegacy {
  name: string;
  buildingName: string;
  roomList: RoomLegacy[];
  totalSpotsNumber: number;
  unavailableSpots: number;
}
