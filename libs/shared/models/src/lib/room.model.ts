import { SubjectName } from '@free-spot/enums';
import { TimeTableItem } from './timetable-item.model';

export interface Room {
  name: string;
  subjectList: SubjectName[];
  timetable: TimeTableItem[];
  freeSpots: number;
  busySpots: number;
  unavailableSpots: number;
}
