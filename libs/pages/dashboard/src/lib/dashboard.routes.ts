import { Route } from '@angular/router';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        // canActivate:[]
        loadComponent: async () => {
          const mod = await import('./components/dashboard.component');
          return mod.DashboardComponent;
        },
      },
      { path: '**', redirectTo: '/' },
    ],
  },
];
