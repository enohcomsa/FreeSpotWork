import { Route } from '@angular/router';

export const DASHBOARD_ROUTES: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        // canActivate:[]
        loadComponent: async () => {
          const mod = await import('./components/free-spot-dashboard/free-spot-dashboard.component');
          return mod.FreeSpotDashboardComponent;
        },
      },
      { path: '**', redirectTo: '/' },
    ],
  },
];
