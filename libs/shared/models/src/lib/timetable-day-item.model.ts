
import { TimetableActivityCardVM } from '@free-spot-presentation/timetable-activity-card';

export interface TimetableDayItem {
  hourInterval: string;
  startHour: number;
  evenWeekActivity?: TimetableActivityCardVM;
  oddWeekActivity?: TimetableActivityCardVM;
  bothWeekActivity?: TimetableActivityCardVM;
}
