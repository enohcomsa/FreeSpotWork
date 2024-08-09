import { ApplicationConfig, importProvidersFrom, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@free-spot-service/auth';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Language } from '@free-spot/enums';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor])),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json'),
          deps: [HttpClient],
        },
        defaultLanguage: Language.EN,
      }),
    ),
  ],
};
