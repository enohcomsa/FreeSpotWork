import { ActivityType, WeekParity } from '@free-spot/enums';
import { SubjectItem } from '@free-spot-domain/subject';

export interface BookedEvent {
  activityType: ActivityType;
  subjectItem: SubjectItem;
  date: Date;
  startHour: number;
  endHour: number;
  weekParity: WeekParity;
  buildingName: string;
  floorName: string;
  roomName: string;
  name?: string;
}
