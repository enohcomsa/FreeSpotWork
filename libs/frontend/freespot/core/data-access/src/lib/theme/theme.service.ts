import { Injectable, signal, WritableSignal } from '@angular/core';
import { type Theme } from '@free-spot/core/domain';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themeSigInternal: WritableSignal<Theme> = signal(
    (JSON.parse(localStorage.getItem('theme') as string) as Theme | null) ?? 'DARK',
  );

  readonly themeSig = this.themeSigInternal.asReadonly();

  getTheme(): Theme {
    return this.themeSigInternal();
  }

  setTheme(theme: Theme): void {
    this.themeSigInternal.set(theme);
  }
}
