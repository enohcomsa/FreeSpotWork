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
        loadChildren: () => import('@free-spot/admin'),
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
