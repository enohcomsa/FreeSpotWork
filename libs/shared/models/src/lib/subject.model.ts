import { Room } from './room.model';

export interface SubjectItem {
  name: string;
  shortName: string;
  professor: string;
  roomList: Room[];
}
