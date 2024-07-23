import { Event } from '@free-spot/enums';
import { SubjectItem } from './subject.model';

export interface BookedEvent {
  activityType: Event;
  subjectItem: SubjectItem;
  date: Date;
  startHour: number;
  endHour: number;
  buildingName: string;
  floorName: string;
  roomName: string;
}
