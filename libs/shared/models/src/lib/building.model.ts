import { FloorLegacy } from './floor.model';

/** @deprecated Firebase-era nested model; remove after migration */
export interface BuildingLegacy {
  name: string;
  adress: string;
  floorList: FloorLegacy[];
  specialEvent: boolean;
  building?: string;
  date?: Date;
  roomName?: string;
  freeSpots?: number;
  reservedSpots?: number;
  busySpots?: number;
  startHour?: number;
}
