import { inject, Injectable } from '@angular/core';
import { take } from 'rxjs';
import { HttpUserPreferencesService } from './http-user-preferences.service';
import { Language, Theme, UpdateMyPreferencesCmd } from './user-preferences.model';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class UserPreferencesStore {
  private readonly _authService = inject(AuthService);
  private readonly _httpUserPreferencesService = inject(HttpUserPreferencesService);

  updateLanguage(language: Language, currentTheme: Theme | null | undefined): void {
    this._updatePreferences({
      preferredLanguage: language,
      preferredTheme: currentTheme ?? Theme.DARK,
    });
  }

  updateTheme(theme: Theme, currentLanguage: Language | null | undefined): void {
    this._updatePreferences({
      preferredLanguage: currentLanguage ?? Language.EN,
      preferredTheme: theme,
    });
  }

  private _updatePreferences(input: UpdateMyPreferencesCmd): void {
    this._httpUserPreferencesService
      .updateMyPreferences$(input)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this._authService.loadMe().pipe(take(1)).subscribe();
        },
        error: (err: unknown) => {
          console.error(err);
        },
      });
  }
}
