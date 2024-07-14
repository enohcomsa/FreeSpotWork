import { SubjectName, Event, WeekParity } from '@free-spot/enums';

export interface TimetableActivityItem {
  startHour: number;
  endHour: number;
  subjectName: SubjectName;
  roomName: string;
  activiteType: Event;
  weekParity: WeekParity;
  freeSpots: number;
  busySpots: number;
}
