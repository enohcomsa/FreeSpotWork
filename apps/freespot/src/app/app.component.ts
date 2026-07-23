import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { LanguageService, ThemeService } from '@free-spot/core/data-access';
import { type Language, type Theme } from '@free-spot/core/domain';
import { TranslateService } from '@ngx-translate/core';

@Component({
  imports: [RouterModule],
  selector: 'free-spot-app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly translateService = inject(TranslateService);
  private readonly themeService = inject(ThemeService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  private readonly lang$ = toObservable(this.languageService.langSig);
  private readonly theme$ = toObservable(this.themeService.themeSig);

  title = 'FreeSpot';

  ngOnInit(): void {
    this.lang$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((lang: Language) => {
      this.translateService.use(lang);
    });

    this.theme$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((theme: Theme) => {
      if (theme === 'DARK') {
        this.document.body.classList.add('dark-mode');
      } else {
        this.document.body.classList.remove('dark-mode');
      }
    });
  }
}
