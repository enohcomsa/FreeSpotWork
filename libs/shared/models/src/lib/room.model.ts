import { TimeTableItem } from './timetable-item.model';
import { SubjectItem } from './subject.model';

export interface Room {
  name: string;
  floorName: string;
  subjectList: SubjectItem[];
  timetable: TimeTableItem[];
  totalSpotsNumber: number;
  unavailableSpots: number;
}
