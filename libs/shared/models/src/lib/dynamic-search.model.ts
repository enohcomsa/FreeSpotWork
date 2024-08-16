import { Event, SubjectName } from '@free-spot/enums';

export interface DynamicSerach {
  event: Event;
  startDate: Date;
  endDate: Date;
  subject: SubjectName;
}
