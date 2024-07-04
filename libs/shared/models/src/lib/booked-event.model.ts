import { Event } from '@free-spot/enums';

export interface BookedEvent {
  eventType: Event;
  subjectName: string;
  date: Date;
  startHour: number;
  endHour: number;
  buildingName: string;
  floorName: string;
  roomName: string;
}
