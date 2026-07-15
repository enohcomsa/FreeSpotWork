import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AuthService, LanguageService, ThemeService, UserPreferencesStore } from '@free-spot/core/data-access';
import { type Language, type Theme } from '@free-spot/core/domain';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { LoadingComponent } from '../loading/loading.component';


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
    MatDividerModule,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  private readonly authService = inject(AuthService);
  private readonly languageService = inject(LanguageService);
  private readonly themeService = inject(ThemeService);
  private readonly userPreferencesStore = inject(UserPreferencesStore);

  opened = false;

  readonly languages = [
    { code: 'en', label: 'English' },
    { code: 'ro', label: 'Română' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'zh-CN', label: '中文' },
    { code: 'ko', label: '한국어' },
  ] as const;

  readonly themes: Theme[] = [
    'LIGHT',
    'DARK',
    'COLORBLIND_LIGHT',
    'COLORBLIND_DARK',
  ];

  readonly currentUserSig = this.authService.userSignal;
  readonly isAdminSig = computed<boolean>(() => this.currentUserSig()?.role === 'ADMIN');

  constructor() {
    toObservable(this.currentUserSig)
      .pipe(
        takeUntilDestroyed(),
        filter((user) => !!user),
      )
      .subscribe((user) => {
        this.languageService.setLang(user.preferredLanguage ?? 'en');
        this.themeService.setTheme(user.preferredTheme ?? 'DARK');
      });
  }

  onLangChange(lang: Language): void {
    this.languageService.setLang(lang);
    this.userPreferencesStore.updateLanguage(lang, this.currentUserSig()?.preferredTheme);
  }

  onThemeChange(theme: Theme): void {
    this.themeService.setTheme(theme);
    this.userPreferencesStore.updateTheme(theme, this.currentUserSig()?.preferredLanguage);
  }

  logout(): void {
    this.authService.logout();
  }

  getLoggedUserName(): string {
    const user = this.currentUserSig();

    if (!user) {
      return '';
    }

    return `${user.firstName ?? ''} ${user.familyName ?? ''}`.trim() || user.email;
  }

  getLoggedUserInitials(): string {
    const user = this.currentUserSig();

    if (!user) {
      return '';
    }

    const first = user.firstName?.charAt(0) ?? '';
    const last = user.familyName?.charAt(0) ?? '';

    return `${first}${last}` || user.email.charAt(0) || '';
  }
}

export default NavigationComponent;
