import { PreferredLanguageDTO, PreferredThemeDTO, UserMePreferencesUpdateDTO } from '@free-spot/api-client';
import { Language, Theme, UpdateMyPreferencesCmd } from './user-preferences.model';

export function toMyPreferencesUpdateDTO(cmd: UpdateMyPreferencesCmd): UserMePreferencesUpdateDTO {
  return {
    preferredLanguage: cmd.preferredLanguage ? languageToDto(cmd.preferredLanguage) : undefined,
    preferredTheme: cmd.preferredTheme ? themeToDto(cmd.preferredTheme) : undefined,
  };
}

function languageToDto(value: Language): PreferredLanguageDTO {
  return value as unknown as PreferredLanguageDTO;
}

function themeToDto(value: Theme): PreferredThemeDTO {
  return value as unknown as PreferredThemeDTO;
}
