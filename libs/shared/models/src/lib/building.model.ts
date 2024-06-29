import { Floor } from './floor.model';

export interface Building {
  name: string;
  adress: string;
  floorList: Floor[];
  specialEvent: boolean;
  building: string;
  room: string;
}
