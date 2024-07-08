import { Event, SubjectName, WeekDay } from '@free-spot/enums';

export interface TimeTableItem {
  startHour: number;
  endHour: number;
  weekDay: WeekDay;
  subjectName: SubjectName;
  roomName: string;
  activiteType: Event;
}
