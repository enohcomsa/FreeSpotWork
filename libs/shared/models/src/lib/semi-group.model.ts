import { FreeSpotUser } from './free-spot-user.model';
import { TimeTableItem } from './timetable-item.model';

export interface SemiGroup {
  name: string;
  students: FreeSpotUser[];
  timetable: TimeTableItem[];
}
