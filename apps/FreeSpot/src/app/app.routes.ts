import { Route } from '@angular/router';
import { authGuard } from '@free-spot/auth';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component').then(),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./navigation/navigation.component'),
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
        loadChildren: () => import('@free-spot/admin').then(),
      },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  { path: '**', redirectTo: 'auth' },
];

