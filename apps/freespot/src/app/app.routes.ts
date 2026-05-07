import { Route } from '@angular/router';
import { authGuard, guestGuard, adminGuard } from '@free-spot/core/data-access';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () => import('@free-spot/core/feature').then((m) => m.AuthComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('@free-spot/core/feature').then((m) => m.NavigationComponent),
    children: [
      {
        path: 'home',
        loadChildren: () => import('@free-spot/home/feature'),
      },
      {
        path: 'schedule',
        loadChildren: () => import('@free-spot/academic-schedule/feature'),
      },
      {
        path: 'my-bookings',
        loadChildren: () => import('@free-spot/my-bookings/feature'),
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadChildren: () => import('@free-spot/admin/feature'),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: '**',
        redirectTo: 'home',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
