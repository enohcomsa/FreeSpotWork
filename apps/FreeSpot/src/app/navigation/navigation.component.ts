import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { AppDateService } from '@free-spot-service/app-date';
import { UserService } from '@free-spot-service/user';
import { FreeSpotUser } from '@free-spot/models';
import { Language, Role, Theme } from '@free-spot/enums';
import { LoadingComponent } from '../loading/loading.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../translate/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, Subscription, take } from 'rxjs';
import { ThemeService } from '../theme/theme.service';
import { AuthService } from '@free-spot-service/auth';

@Component({
  selector: 'free-spot-navigation',
  standalone: true,
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
export class NavigationComponent implements OnInit {
  private _authService: AuthService = inject(AuthService);
  private _appDateService: AppDateService = inject(AppDateService);
  private _userService: UserService = inject(UserService);
  private _languageService: LanguageService = inject(LanguageService);
  private _themeService: ThemeService = inject(ThemeService);
  private _destroyRef = inject(DestroyRef);

  opened = false;
  LANG = Language;
  THEME = Theme;

  Role = Role;
  private _currentUserEmail = (
    JSON.parse(localStorage.getItem('user') as string) as {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: Date;
    }
  ).email;

  currentUserSig: Signal<FreeSpotUser> = this._userService.getFreeSpotUserByEmail(this._currentUserEmail);
  currentUserSubscription: Subscription = toObservable(this.currentUserSig)
    .pipe(
      takeUntilDestroyed(this._destroyRef),
      filter((user: FreeSpotUser) => Object.keys(user).length !== 0),
      take(1),
    )
    .subscribe((user: FreeSpotUser) => {
      this._languageService.setLang(user.preferdLanguage || Language.EN);
      this._themeService.setTheme(user.preferedTheme || Theme.DARK);
    });

  ngOnInit(): void {
    this._appDateService.init();
  }

  onLangChange(lang: Language, oldUser: FreeSpotUser): void {
    this._languageService.setLang(lang);
    const updatedUser: FreeSpotUser = { ...oldUser, preferdLanguage: lang };
    this._userService.updateFreeSpotUser(oldUser, updatedUser);
    localStorage.setItem('lang', JSON.stringify(lang));
  }

  onThemeChange(theme: Theme, oldUser: FreeSpotUser): void {
    this._themeService.setTheme(theme);
    const updatedUser: FreeSpotUser = { ...oldUser, preferedTheme: theme };
    this._userService.updateFreeSpotUser(oldUser, updatedUser);
    localStorage.setItem('theme', JSON.stringify(theme));
  }

  logout(): void {
    this._authService.logOut();
  }

  getLoggedUserName(): string {
    return this.currentUserSig().firstName + '  ' + this.currentUserSig().familyName;
  }

  getLoggedUserInitials(): string {
    return (this.currentUserSig().firstName.charAt(0) + this.currentUserSig().familyName.charAt(0)).toUpperCase();
  }
}

export default NavigationComponent;
