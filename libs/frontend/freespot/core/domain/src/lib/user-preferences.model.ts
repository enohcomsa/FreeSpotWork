export type Theme =
  | 'LIGHT'
  | 'DARK'
  | 'COLORBLIND_LIGHT'
  | 'COLORBLIND_DARK';

export type Language = 'ro' | 'en';

export type UpdateMyPreferencesCmd = {
  preferredLanguage?: Language | null;
  preferredTheme?: Theme | null;
};
