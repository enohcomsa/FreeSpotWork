import { Component, DestroyRef, inject, OnInit, DOCUMENT } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@free-spot-service/auth';
import { LanguageService } from './translate/language.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Language, Theme } from '@free-spot/enums';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './theme/theme.service';


@Component({

  imports: [RouterModule],
  selector: 'free-spot-app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'FreeSpot';
  private _authService: AuthService = inject(AuthService);
  private _languageService: LanguageService = inject(LanguageService);
  private _translateService: TranslateService = inject(TranslateService);
  private _themeService: ThemeService = inject(ThemeService);
  private _document = inject(DOCUMENT);
  destroyRef = inject(DestroyRef);

  private _lang$ = toObservable(this._languageService.langSig);
  private _theme$ = toObservable(this._themeService.themeSig);

  ngOnInit(): void {
    this._authService.autoLogIn();
    this._lang$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((lang: Language) => {
      this._translateService.use(lang);
    });

    this._theme$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((theme: Theme) => {
      if (theme === Theme.DARK) {
        this._document.body.classList.add('dark-mode');
      } else {
        this._document.body.classList.remove('dark-mode');
      }
    });
  }
}

