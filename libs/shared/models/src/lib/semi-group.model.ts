import { FreeSpotUser } from './free-spot-user.model';
import { TimeTableItemLecagy } from './timetable-item.model';

export interface SemiGroup {
  name: string;
  students: FreeSpotUser[];
  timetable: TimeTableItemLecagy[];
}
