import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { LoadingComponent } from '../../../../src/lib/loading/loading.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../../../src/lib/i18n/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../../../src/lib/theme/theme.service';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { Language, Theme, Role } from '@free-spot/core/domain';
import { AuthService, UserPreferencesStore } from '@free-spot/core/data-access';

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
  private _userPreferencesStore = inject(UserPreferencesStore);

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
    this._userPreferencesStore.updateLanguage(lang, this.currentUserSig()?.preferredTheme);
  }

  onThemeChange(theme: Theme): void {
    this._themeService.setTheme(theme);
    this._userPreferencesStore.updateTheme(theme, this.currentUserSig()?.preferredLanguage);
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
