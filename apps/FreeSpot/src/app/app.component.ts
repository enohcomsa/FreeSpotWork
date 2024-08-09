import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@free-spot-service/auth';
import { LanguageService } from './translate/language.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Language } from '@free-spot/enums';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'free-spot-app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'FreeSpot';
  private _authService: AuthService = inject(AuthService);
  private _languageService: LanguageService = inject(LanguageService);
  private _translateService: TranslateService = inject(TranslateService);
  destroyRef = inject(DestroyRef);

  private _lang$ = toObservable(this._languageService.langSig);

  ngOnInit(): void {
    this._authService.autoLogIn();
    this._lang$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((lang: Language) => {
      this._translateService.use(lang);
    });
  }
}

