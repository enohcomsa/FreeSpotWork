import { Event, WeekParity } from '@free-spot/enums';
import { SubjectItemLegacy } from './subject.model';

export interface TimetableActivityItem {
  startHour: number;
  endHour: number;
  subjectItem: SubjectItemLegacy;
  roomName: string;
  activityType: Event;
  weekParity: WeekParity;
  freeSpots: number;
  busySpots: number;
  date: Date;
  name?: string;
}
