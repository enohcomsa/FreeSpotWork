import { SubjectName } from '@free-spot/enums';
import { TimeTableItem } from './timetable-item.model';

export interface Room {
  name: string;
  floorName: string;
  subjectList: SubjectName[];
  timetable: TimeTableItem[];
  totalSpotsNumber: number;
  unavailableSpots: number;
}
