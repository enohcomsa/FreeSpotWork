import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { Language, Role, Theme } from '@free-spot/enums';
import { LoadingComponent } from '../loading/loading.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../translate/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../theme/theme.service';
import { AuthService } from '@free-spot-service/auth';
import { HttpUserService } from '@http-free-spot/user';
import { take } from 'rxjs';
import { UpdateMyPreferencesCmd } from '@free-spot-domain/user';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  selector: 'free-spot-navigation',
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    LoadingComponent,
    MatMenuModule,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  private _authService = inject(AuthService);
  private _languageService = inject(LanguageService);
  private _themeService = inject(ThemeService);
  private _httpUserService = inject(HttpUserService);

  opened = false;
  LANG = Language;
  THEME = Theme;
  Role = Role;

  readonly currentUserSig = this._authService.userSignal$;
  readonly isAdminSig = computed(() => this.currentUserSig()?.role === Role.ADMIN);

  constructor() {
    toObservable(this.currentUserSig)
      .pipe(
        takeUntilDestroyed(),
        filter((user) => !!user),
      )
      .subscribe((user) => {
        if (!user) return;

        this._languageService.setLang(user.preferredLanguage || Language.EN);
        this._themeService.setTheme(user.preferredTheme || Theme.DARK);
      });
  }

  onLangChange(lang: Language): void {
    this._languageService.setLang(lang);

    const input: UpdateMyPreferencesCmd = {
      preferredLanguage: lang,
      preferredTheme: this.currentUserSig()?.preferredTheme || Theme.DARK,
    };

    this._httpUserService
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

  onThemeChange(theme: Theme): void {
    this._themeService.setTheme(theme);

    const input: UpdateMyPreferencesCmd = {
      preferredLanguage: this.currentUserSig()?.preferredLanguage || Language.EN,
      preferredTheme: theme,
    };

    this._httpUserService
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

  logout(): void {
    this._authService.logout();
  }

  getLoggedUserName(): string {
    const user = this.currentUserSig();
    if (!user) return '';

    return `${user.firstName ?? ''} ${user.familyName ?? ''}`.trim() || user.email;
  }

  getLoggedUserInitials(): string {
    const user = this.currentUserSig();
    if (!user) return '';

    const first = user.firstName?.charAt(0) ?? '';
    const last = user.familyName?.charAt(0) ?? '';

    return `${first}${last}` || user.email.charAt(0) || '';
  }
}

export default NavigationComponent;
