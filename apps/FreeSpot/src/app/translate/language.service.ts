import { Injectable, signal, WritableSignal } from '@angular/core';
import { Language } from '@free-spot/enums';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private _langSig: WritableSignal<Language> = signal(Language.EN);
  langSig = this._langSig.asReadonly();

  getLang(): Language {
    return this._langSig();
  }

  setLang(lang: Language): void {
    this._langSig.set(lang);
  }
}
