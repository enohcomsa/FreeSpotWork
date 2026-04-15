import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: async () => {
          const mod = await import('./components/my-bookings/my-bookings.component');
          return mod.MyBookingsComponent;
        },
      },
      { path: '**', redirectTo: '/' },
    ],
  },
];
