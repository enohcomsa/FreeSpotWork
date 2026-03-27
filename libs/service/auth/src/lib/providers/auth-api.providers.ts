import { Provider } from '@angular/core';
import { BASE_PATH, Configuration } from '@free-spot/api-client';

const API_BASE_URL = 'https://freespotwork.onrender.com/api/v1';

export function provideAuthApi(): Provider[] {
  return [
    {
      provide: BASE_PATH,
      useValue: API_BASE_URL,
    },
    {
      provide: Configuration,
      useFactory: () =>
        new Configuration({
          basePath: API_BASE_URL,
          withCredentials: true,
        }),
    },
  ];
}
