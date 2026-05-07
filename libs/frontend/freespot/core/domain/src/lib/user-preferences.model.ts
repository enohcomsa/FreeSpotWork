export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  COLORBLIND_LIGHT = 'COLORBLIND_LIGHT',
  COLORBLIND_DARK = 'COLORBLIND_DARK',
}

export enum Language {
  RO = 'ro',
  EN = 'en',
}

export type UpdateMyPreferencesCmd = {
  preferredLanguage?: Language | null;
  preferredTheme?: Theme | null;
};
