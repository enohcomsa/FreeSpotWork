import { FreeSpotUser } from './free-spot-user.model';
import { TimeTableItemLecagy } from './timetable-item.model';

/**
 * @deprecated since v2.0
 * Legacy structure. Replaced by Cohort-based grouping.
 * Do not use for new features.
 */
export interface SemiGroup {
  name: string;
  students: FreeSpotUser[];
  timetable: TimeTableItemLecagy[];
}
