import { Theme } from "@free-spot/core/domain";
import { PreferredThemeDTO } from "@free-spot/api-client";

export const dtoToTheme = (dto: PreferredThemeDTO): Theme => dto as unknown as Theme;
export const themeToDto = (value: Theme): PreferredThemeDTO => value as unknown as PreferredThemeDTO;
