import { Route } from '@angular/router';
import { adminGuard, authGuard, guestGuard } from '@free-spot-service/auth';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () => import('./auth/auth.component').then((m) => m.default),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./navigation/navigation.component').then((m) => m.default),
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('@free-spot/dashboard'),
      },
      {
        path: 'schedule',
        loadChildren: () => import('@free-spot/schedule'),
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
