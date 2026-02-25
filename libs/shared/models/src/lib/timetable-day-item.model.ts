import { TimetableActivityItemLegacy } from './timetable-activity-item.model';
import { TimetableActivityCardVM } from '@free-spot-presentation/timetable-activity-card';

export interface TimetableDayItemLecagy {
  hourInterval: string;
  startHour: number;
  evenWeekActivity?: TimetableActivityItemLegacy;
  oddWeekActivity?: TimetableActivityItemLegacy;
  bothWeekActivity?: TimetableActivityItemLegacy;
}

export interface TimetableDayItem {
  hourInterval: string;
  startHour: number;
  evenWeekActivity?: TimetableActivityCardVM;
  oddWeekActivity?: TimetableActivityCardVM;
  bothWeekActivity?: TimetableActivityCardVM;
}
