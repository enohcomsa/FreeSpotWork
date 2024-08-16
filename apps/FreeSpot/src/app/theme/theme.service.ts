import { Injectable, signal, WritableSignal } from '@angular/core';
import { Theme } from '@free-spot/enums';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _themeSig: WritableSignal<Theme> = signal(JSON.parse(localStorage.getItem('theme') as string) || Theme.DARK);
  themeSig = this._themeSig.asReadonly();

  getTheme(): Theme {
    return this._themeSig();
  }

  setTheme(lang: Theme): void {
    this._themeSig.set(lang);
  }
}
