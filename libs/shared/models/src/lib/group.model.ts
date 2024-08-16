import { FreeSpotUser } from './free-spot-user.model';
import { SemiGroup } from './semi-group.model';
import { TimeTableItem } from './timetable-item.model';

export interface Group {
  name: string;
  studentList: FreeSpotUser[];
  timetable: TimeTableItem[];
  semigroups?: SemiGroup[];
}
