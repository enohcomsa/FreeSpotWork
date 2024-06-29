import { Language, Role, Theme } from '@free-spot/enums';

export interface FreeSpotUser {
  role?: Role;
  familyName?: string;
  firstName?: string;
  email: string;
  group?: string;
  semiGroup?: string;
  faculty?: string;
  specialization?: string;
  currentYear?: number;
  preferdLanguage?: Language;
  preferedTheme?: Theme;
}
