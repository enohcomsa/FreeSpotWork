import { Route } from '@angular/router';

export const myBookingsRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        // canActivate:[]
        loadComponent: async () => {
          const mod = await import('./components/my-bookings/my-bookings.component');
          return mod.MyBookingsComponent;
        },
      },
      { path: '**', redirectTo: '/' },
    ],
  },
];
