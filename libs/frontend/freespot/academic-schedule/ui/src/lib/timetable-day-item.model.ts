import { TimetableActivityCardVM } from '@free-spot/academic-schedule/domain';

export interface TimetableDayItem {
  hourInterval: string;
  startHour: number;
  evenWeekActivity?: TimetableActivityCardVM;
  oddWeekActivity?: TimetableActivityCardVM;
  bothWeekActivity?: TimetableActivityCardVM;
}
