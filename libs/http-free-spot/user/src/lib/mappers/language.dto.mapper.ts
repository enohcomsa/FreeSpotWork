import { Language } from "@free-spot/core/domain";
import { PreferredLanguageDTO } from "@free-spot/api-client";

export const dtoToLanguage = (dto: PreferredLanguageDTO): Language => dto as unknown as Language;
export const languageToDto = (value: Language): PreferredLanguageDTO => value as unknown as PreferredLanguageDTO;
