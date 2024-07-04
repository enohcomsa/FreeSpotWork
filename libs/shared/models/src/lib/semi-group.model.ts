import { TimeTableItem } from './timetable-item.model';

export interface SemiGroup {
  name: string;
  students: string[];
  timeTable: TimeTableItem[];
}
