import { Language, Role, Theme } from '@free-spot/enums';
import { BookedEvent } from './booked-event.model';

export interface FreeSpotUser {
  role: Role;
  familyName: string;
  firstName: string;
  email: string;
  faculty?: string;
  currentYear?: string;
  group?: string;
  semiGroup?: string;
  preferdLanguage?: Language;
  preferedTheme?: Theme;
  bookingList: BookedEvent[];
  eventList?: BookedEvent[];
}
