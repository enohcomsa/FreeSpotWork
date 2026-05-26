import { inject, Injectable } from '@angular/core';
import { type Language, type Theme, type UpdateMyPreferencesCmd } from '@free-spot/core/domain';
import { take } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { HttpUserPreferencesService } from './http-user-preferences.service';

@Injectable({ providedIn: 'root' })
export class UserPreferencesStore {
  private readonly authService = inject(AuthService);
  private readonly httpUserPreferencesService = inject(HttpUserPreferencesService);

  updateLanguage(language: Language, currentTheme: Theme | null | undefined): void {
    this.updatePreferences({
      preferredLanguage: language,
      preferredTheme: currentTheme ?? 'DARK',
    });
  }

  updateTheme(theme: Theme, currentLanguage: Language | null | undefined): void {
    this.updatePreferences({
      preferredLanguage: currentLanguage ?? 'en',
      preferredTheme: theme,
    });
  }

  private updatePreferences(input: UpdateMyPreferencesCmd): void {
    this.httpUserPreferencesService
      .updateMyPreferences$(input)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.authService.loadMe().pipe(take(1)).subscribe();
        },
        error: (err: unknown) => {
          console.error(err);
        },
      });
  }
}
