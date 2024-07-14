import { Language, Role, Theme } from '@free-spot/enums';
import { BookedEvent } from './booked-event.model';

export interface FreeSpotUser {
  role: Role;
  familyName: string;
  firstName: string;
  email: string;
  year?: string;
  group?: string;
  semiGroup?: string;
  faculty?: string;
  specialization?: string;
  currentYear?: number;
  preferdLanguage?: Language;
  preferedTheme?: Theme;
  bookingList: BookedEvent[];
}
