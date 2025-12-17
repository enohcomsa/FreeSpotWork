import { Event, WeekParity } from '@free-spot/enums';
import { SubjectItemLegacy } from './subject.model';
/**
 * @deprecated Firebase-era nested model;
 * used only for backward compatibility with legacy timetable format.
 * Remove once all timetable data is migrated.
 */
export interface TimetableActivityItemLegacy {
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
