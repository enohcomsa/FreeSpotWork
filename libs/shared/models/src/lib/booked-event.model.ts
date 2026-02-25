import { Event, WeekParity } from '@free-spot/enums';
import { SubjectItemLegacy } from './subject.model';

export interface BookedEvent {
  activityType: Event;
  subjectItem: SubjectItemLegacy;
  date: Date;
  startHour: number;
  endHour: number;
  weekParity: WeekParity;
  buildingName: string;
  floorName: string;
  roomName: string;
  name?: string;
}
