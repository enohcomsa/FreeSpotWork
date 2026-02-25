import { FreeSpotUser } from './free-spot-user.model';
import { SemiGroup } from './semi-group.model';
import { TimeTableItemLecagy } from './timetable-item.model';
/**
 * @deprecated Use ProgramYear / Cohort-based structures instead.
 * This legacy Group model will be removed in a future version.
 */
export interface GroupLegacy {
  name: string;
  studentList: FreeSpotUser[];
  timetable: TimeTableItemLecagy[];
  semigroups?: SemiGroup[];
}
