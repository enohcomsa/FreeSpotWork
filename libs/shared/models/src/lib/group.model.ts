import { SemiGroup } from './semi-group.model';
import { TimeTableItem } from './timetable-item.model';

export interface Group {
  name: string;
  students: string;
  timeTable: TimeTableItem;
  semigroups?: SemiGroup[];
}
