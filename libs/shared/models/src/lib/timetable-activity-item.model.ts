import { Event, WeekParity } from '@free-spot/enums';
import { SubjectItem } from './subject.model';

export interface TimetableActivityItem {
  startHour: number;
  endHour: number;
  subjectItem: SubjectItem;
  roomName: string;
  activityType: Event;
  weekParity: WeekParity;
  freeSpots: number;
  busySpots: number;
}
