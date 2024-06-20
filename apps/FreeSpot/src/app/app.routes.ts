import { Route } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth/auth.component').then(),
  },
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
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  { path: '**', redirectTo: 'auth' },
];

