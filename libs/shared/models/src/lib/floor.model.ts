import { Room } from './room.model';

export interface Floor {
  name: string;
  buildingName: string;
  roomList: Room[];
  totalSpotsNumber: number;
  unavailableSpots: number;
}
