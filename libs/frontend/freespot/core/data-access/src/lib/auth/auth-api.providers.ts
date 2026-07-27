import { Provider } from '@angular/core';
import { BASE_PATH, Configuration } from '@free-spot/api-client';
import { APP_CONFIG, AppConfig } from '@free-spot/core/domain';

export function provideAuthApi(): Provider[] {
  return [
    {
      provide: BASE_PATH,
      deps: [APP_CONFIG],
      useFactory: (config: AppConfig) => config.apiBaseUrl,
    },
    {
      provide: Configuration,
      deps: [APP_CONFIG],
      useFactory: (config: AppConfig) =>
        new Configuration({
          basePath: config.apiBaseUrl,
          withCredentials: true,
        }),
    },
  ];
}
