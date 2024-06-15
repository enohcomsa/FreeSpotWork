import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth/auth.component').then(),
  },
  { path: '**', redirectTo: 'auth' },
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
];

