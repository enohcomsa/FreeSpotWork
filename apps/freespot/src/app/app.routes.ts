import { Route } from '@angular/router';
import { adminGuard, authGuard, guestGuard } from '@free-spot-service/auth';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () => import('@frontend/freespot/core').then((m) => m.AuthComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('@frontend/freespot/core').then((m) => m.NavigationComponent),
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('@free-spot/dashboard'),
      },
      {
        path: 'schedule',
        loadChildren: () => import('@frontend/freespot/schedule/feature-schedule'),
      },
      {
        path: 'my-bookings',
        loadChildren: () => import('@free-spot/my-bookings'),
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadChildren: () => import('@free-spot/admin'),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
