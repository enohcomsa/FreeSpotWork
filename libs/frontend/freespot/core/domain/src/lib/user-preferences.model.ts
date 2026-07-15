export type Theme =
  | 'LIGHT'
  | 'DARK'
  | 'COLORBLIND_LIGHT'
  | 'COLORBLIND_DARK';

export type Language = 'en' | 'ro' | 'hi' | 'zh-CN' | 'ko';

export type UpdateMyPreferencesCmd = {
  preferredLanguage?: Language | null;
  preferredTheme?: Theme | null;
};
