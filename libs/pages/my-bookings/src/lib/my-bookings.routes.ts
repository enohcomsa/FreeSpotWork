import { Route } from '@angular/router';

export const myBookingsRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: async () => {
          const mod = await import('@free-spot/activity-bookings/feature');
          return mod.MyActivityBookingsComponent;
        },
      },
      { path: '**', redirectTo: '/' },
    ],
  },
];
