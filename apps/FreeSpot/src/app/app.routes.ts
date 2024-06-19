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
    loadComponent: () => import('@free-spot/dashboard').then((m) => m.FreeSpotDashboardComponent),
  },
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  { path: '**', redirectTo: 'auth' },
];

