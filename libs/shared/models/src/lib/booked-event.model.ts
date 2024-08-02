import { Event, WeekParity } from '@free-spot/enums';
import { SubjectItem } from './subject.model';

export interface BookedEvent {
  activityType: Event;
  subjectItem: SubjectItem;
  date: Date;
  startHour: number;
  endHour: number;
  weekParity: WeekParity;
  buildingName: string;
  floorName: string;
  roomName: string;
}
