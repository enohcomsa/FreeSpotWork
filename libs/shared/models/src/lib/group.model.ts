import { FreeSpotUser } from './free-spot-user.model';
import { SemiGroup } from './semi-group.model';
import { TimeTableItemLecagy } from './timetable-item.model';

export interface Group {
  name: string;
  studentList: FreeSpotUser[];
  timetable: TimeTableItemLecagy[];
  semigroups?: SemiGroup[];
}
