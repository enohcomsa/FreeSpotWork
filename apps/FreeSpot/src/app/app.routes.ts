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
        loadChildren: () => import('@free-spot/dashboard').then(),
      },
      {
        path: 'schedule',
        loadChildren: () => import('@free-spot/schedule').then(),
      },
      {
        path: 'my-bookings',
        loadChildren: () => import('@free-spot/my-bookings').then(),
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadChildren: () => import('@free-spot/admin').then(),
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
