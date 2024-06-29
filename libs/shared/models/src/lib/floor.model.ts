import { Room } from './room.model';

export interface Floor {
  name: string;
  roomList: Room[];
  totalSpotsNumber: number;
  freeSpots: number;
  busySpots: number;
  unavailableSpots: number;
}
