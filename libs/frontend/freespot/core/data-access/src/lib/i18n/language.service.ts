import { Injectable, signal, WritableSignal } from '@angular/core';
import { type Language } from '@free-spot/core/domain';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly langSigInternal: WritableSignal<Language> = signal(
    (JSON.parse(localStorage.getItem('lang') as string) as Language | null) ?? 'en',
  );

  readonly langSig = this.langSigInternal.asReadonly();

  getLang(): Language {
    return this.langSigInternal();
  }

  setLang(lang: Language): void {
    this.langSigInternal.set(lang);
  }
}
