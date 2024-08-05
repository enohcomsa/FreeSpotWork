import { Route } from '@angular/router';
import { authGuard } from '@free-spot-service/auth';
import { adminGuard } from './guards/admin-guard.guard';

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
        canActivate: [authGuard],
        loadChildren: () => import('@free-spot/dashboard').then(),
      },
      {
        path: 'schedule',
        canActivate: [authGuard],

        loadChildren: () => import('@free-spot/schedule').then(),
      },
      {
        path: 'my-bookings',
        canActivate: [authGuard],
        loadChildren: () => import('@free-spot/my-bookings').then(),
      },
      {
        path: 'admin',
        canActivate: [authGuard, adminGuard],
        loadChildren: () => import('@free-spot/admin').then(),
      },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  { path: '**', redirectTo: 'auth' },
];

